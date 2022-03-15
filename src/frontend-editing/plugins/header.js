import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import first from '@ckeditor/ckeditor5-utils/src/first';
import {enablePlaceholder, hidePlaceholder, needsPlaceholder, showPlaceholder} from '@ckeditor/ckeditor5-engine';

const _headerTagName = 'header';
const _titleTagName = 'h2';
const _subtitleTagName = 'p';

/**
 * The Header plugin.
 *
 * It splits the document into `Header` and `Body` sections.
 */
export default class Header extends Plugin {
    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'Header';
    }

    /**
     * @inheritDoc
     */
    static get requires() {
        return ['Paragraph'];
    }

    /**
     * @inheritDoc
     */
    init() {
        const editor = this.editor;
        const model = editor.model;

        editor.config.define('header', {enable: true});
        if (!editor.config.get('header.enable')) {
            // Return early if plugin is disabled =)
            return;
        }

        /**
         * A reference to an empty paragraph in the body
         * created when there is no element in the body for the placeholder purposes.
         *
         * @private
         * @type {null|module:engine/model/element~Element}
         */
        this._bodyPlaceholder = null;

        this._headerElementName = 'header';
        this._titleElementName = 'title';
        this._subtitleElementName = 'subtitle';

        // <header>
        //     <title>The title text</title>
        //     <subtitle>The subtitle text</subtitle>
        // </header>
        model.schema.register(this._headerElementName, {isObject: true, allowIn: '$root'});
        model.schema.register(this._titleElementName, {
            isObject: true,
            allowIn: this._headerElementName,
            allowAttributes: ['alignment']
        });
        model.schema.extend('$text', {allowIn: this._titleElementName, isInline: true});
        if (!!this.editor.config.get('subtitle.enable')) {
            model.schema.register(this._subtitleElementName, {
                isObject: true,
                allowIn: this._headerElementName,
                allowAttributes: ['alignment']
            });
            model.schema.extend('$text', {allowIn: this._subtitleElementName, isInline: true});
        }

        // Disallow all attributes in `title-content`.
        model.schema.addAttributeCheck(context => {
            if (context.endsWith(this._titleElementName + ' $text') || context.endsWith(this._subtitleElementName + ' $text')) {
                return false;
            }
        });

        // Conversion.
        editor.conversion.elementToElement({
            model: this._headerElementName,
            view: editor.config.get('header.view') || _headerTagName
        });
        // @see https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/conversion/upcast.html#converting-structures
        // editor.conversion.for('upcast').add(dispatcher => {
        //     dispatcher.on('element:' + _headerTagName, (evt, data, conversionApi) => {
        //         const {
        //             consumable,
        //             writer,
        //             safeInsert,
        //             convertChildren,
        //             updateConversionResult
        //         } = conversionApi;
        //
        //         // Get view item from data object.
        //         const { viewItem } = data;
        //
        //         if(viewItem !== viewItem.parent.getChild(0)) {
        //             return;
        //         }
        //
        //         consumable.consume();
        //     });

            // model: 'post-title',
            // view: {
            //     name: 'div',
            //     classes: 'title'
            // }
        // });
        editor.conversion.elementToElement({
            model: this._titleElementName,
            view: editor.config.get('title.view') || _titleTagName,
            converterPriority: 'high'
        });
        if (!!editor.config.get('subtitle.enable')) {
            editor.conversion.elementToElement({
                model: this._subtitleElementName,
                view: editor.config.get('subtitle.view') || _subtitleTagName,
                converterPriority: 'high'
            });
        }

        // Take care about correct `header` element structure.
        model.document.registerPostFixer(writer => this._fixHeaderContent(writer));

        // Create and take care of correct position of a `header` element.
        model.document.registerPostFixer(writer => this._fixHeaderElement(writer));

        // Create element for `Body` placeholder if it is missing.
        model.document.registerPostFixer(writer => this._fixBodyElement(writer));

        // Prevent from adding extra at the end of the document.
        model.document.registerPostFixer(writer => this._fixExtraParagraph(writer));

        // Attach `Header` and `Body` placeholders to the empty title and/or content.
        this._attachPlaceholders();

        // Attach Tab handling.
        // this._attachTabPressHandling();
    }

    /**
     * Returns the `header` element when it is in the document. Returns `undefined` otherwise.
     *
     * @private
     * @returns {module:engine/model/element~Element|undefined}
     */
    _getHeaderElement() {
        const root = this.editor.model.document.getRoot();

        for (const child of root.getChildren()) {
            if (isHeader(child)) {
                return child;
            }
        }
    }

    /**
     * Model post-fixer callback that ensures that `header` has only one `title` and `subtitle` children.
     * All additional children should be moved after the `header` element and renamed to a paragraph.
     *
     * @private
     * @param {module:engine/model/writer~Writer} writer
     * @returns {Boolean}
     */
    _fixHeaderContent(writer) {
        const header = this._getHeaderElement();

        if (!header) {
            return false;
        }

        const headerChildren = Array.from(header.getChildren());

        if (headerChildren[0]) {
            if (!headerChildren[0].is('element', this._titleElementName)) {
                writer.rename(headerChildren[0], this._titleElementName);
            }
            headerChildren.shift();
        }

        if (header.maxOffset === 1) {
            return false;
        }

        if (!!this.editor.config.get('subtitle.enable')) {
            if (headerChildren[0]) {
                if (!headerChildren[0].is('element', this._subtitleElementName)) {
                    writer.rename(headerChildren[0], this._subtitleElementName);
                }
                headerChildren.shift();
            }

            if (header.maxOffset === 2) {
                return false;
            }
        }

        // If there are more than two elements in `header`, move them to `body`
        for (const headerChild of headerChildren) {
            writer.move(writer.createRangeOn(headerChild), header, 'after');
            writer.rename(headerChild, 'paragraph');
        }

        return true;
    }

    /**
     * Model post-fixer callback that creates a header element when it is missing,
     * takes care of the correct position of it.
     *
     * @private
     * @param {module:engine/model/writer~Writer} writer
     * @returns {Boolean}
     */
    _fixHeaderElement(writer) {
        const model = this.editor.model;
        const modelRoot = model.document.getRoot();
        let header = this._getHeaderElement();
        const firstRootChild = modelRoot.getChild(0);

        // When title element is at the beginning of the document, return early
        if (isHeader(firstRootChild)) {
            return false;
        }

        header = writer.createElement(this._headerElementName);

        writer.insert(header, modelRoot);
        writer.insertElement(this._titleElementName, header, 'end');
        if (!!this.editor.config.get('subtitle.enable')) {
            writer.insertElement(this._subtitleElementName, header, 'end');
        }

        return true;
    }

    /**
     * Model post-fixer callback that adds an empty paragraph at the end of the document
     * when it is needed for the placeholder purposes.
     *
     * @private
     * @param {module:engine/model/writer~Writer} writer
     * @returns {Boolean}
     */
    _fixBodyElement(writer) {
        const modelRoot = this.editor.model.document.getRoot();

        if (modelRoot.childCount < 2) {
            this._bodyPlaceholder = writer.createElement('paragraph');
            writer.insert(this._bodyPlaceholder, modelRoot, 1);

            // Return true tells ckeditor "we modified something, run all post-fixers again"
            // @see https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_document-Document.html#function-registerPostFixer
            return true;
        }

        return false;
    }

    /**
     * Model post-fixer callback that removes a paragraph from the end of the document
     * if it was created for the placeholder purposes and is not needed anymore.
     *
     * @private
     * @param {module:engine/model/writer~Writer} writer
     * @returns {Boolean}
     */
    _fixExtraParagraph(writer) {
        const root = this.editor.model.document.getRoot();
        const placeholder = this._bodyPlaceholder;

        if (shouldRemoveLastParagraph(placeholder, root)) {
            this._bodyPlaceholder = null;
            writer.remove(placeholder);

            return true;
        }

        return false;
    }

    /**
     * Attaches the `Title/Subtitle` and `Body` placeholders to the header and/or content.
     *
     * @private
     */
    _attachPlaceholders() {
        const editor = this.editor;
        const t = editor.t;
        const view = editor.editing.view;
        const viewRoot = view.document.getRoot();
        const sourceElement = editor.sourceElement;

        const titlePlaceholder = editor.config.get('title.placeholder') || t('Type your title');
        const subtitlePlaceholder = editor.config.get('subtitle.placeholder') || t('Type your subtitle');
        const bodyPlaceholder = editor.config.get('placeholder') ||
            sourceElement && sourceElement.tagName.toLowerCase() === 'textarea' && sourceElement.getAttribute('placeholder') ||
            t('Type or paste your content here.');

        // Attach placeholder to the view title element.
        editor.editing.downcastDispatcher.on('insert:' + this._titleElementName, (evt, data, conversionApi) => {
            enablePlaceholder({
                view,
                element: conversionApi.mapper.toViewElement(data.item),
                text: titlePlaceholder,
                keepOnFocus: true
            });
        });
        if (!!editor.config.get('subtitle.enable')) {
            editor.editing.downcastDispatcher.on('insert:' + this._subtitleElementName, (evt, data, conversionApi) => {
                enablePlaceholder({
                    view,
                    element: conversionApi.mapper.toViewElement(data.item),
                    text: subtitlePlaceholder,
                    keepOnFocus: true
                });
            });
        }

        // Attach placeholder to first element after a title element and remove it if it's not needed anymore.
        // First element after title can change so we need to observe all changes keep placeholder in sync.
        let oldBody;

        // This post-fixer runs after the model post-fixer so we can assume that
        // the second child in view root will always exist.
        view.document.registerPostFixer(writer => {
            const body = viewRoot.getChild(1);
            let hasChanged = false;

            // If body element has changed we need to disable placeholder on the previous element
            // and enable on the new one.
            if (body !== oldBody) {
                if (oldBody) {
                    hidePlaceholder(writer, oldBody);
                    writer.removeAttribute('data-placeholder', oldBody);
                }

                writer.setAttribute('data-placeholder', bodyPlaceholder, body);
                oldBody = body;
                hasChanged = true;
            }

            // Then we need to display placeholder if it is needed.
            // See: https://github.com/ckeditor/ckeditor5/issues/8689.
            if (needsPlaceholder(body, true) && viewRoot.childCount === 2 && body.name === 'p') {
                hasChanged = showPlaceholder(writer, body) ? true : hasChanged;
                // Or hide if it is not needed.
            } else {
                hasChanged = hidePlaceholder(writer, body) ? true : hasChanged;
            }

            return hasChanged;
        });
    }

    /**
     * Creates navigation between the title and body sections using <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> keys.
     *
     * @private
     */
    _attachTabPressHandling() {
        const editor = this.editor;
        const model = editor.model;

        // Pressing <kbd>Tab</kbd> inside the title should move the caret to the body.
        editor.keystrokes.set('TAB', (data, cancel) => {
            model.change(writer => {
                const selection = model.document.selection;
                const selectedElements = Array.from(selection.getSelectedBlocks());

                if (selectedElements.length === 1 && selectedElements[0].is('element', 'title-content')) {
                    const firstBodyElement = model.document.getRoot().getChild(1);
                    writer.setSelection(firstBodyElement, 0);
                    cancel();
                }
            });
        });

        // Pressing <kbd>Shift</kbd>+<kbd>Tab</kbd> at the beginning of the body should move the caret to the title.
        editor.keystrokes.set('SHIFT + TAB', (data, cancel) => {
            model.change(writer => {
                const selection = model.document.selection;

                if (!selection.isCollapsed) {
                    return;
                }

                const root = editor.model.document.getRoot();
                const selectedElement = first(selection.getSelectedBlocks());
                const selectionPosition = selection.getFirstPosition();

                const title = root.getChild(0);
                const body = root.getChild(1);

                if (selectedElement === body && selectionPosition.isAtStart) {
                    writer.setSelection(title.getChild(0), 0);
                    cancel();
                }
            });
        });
    }
}

// Returns true when given element is a header. Returns false otherwise.
//
// @param {module:engine/model/element~Element} element
// @returns {Boolean}
function isHeader(element) {
    return element.is('element', _headerTagName);
}

// Changes the given element to the title element.
//
// @param {module:engine/model/element~Element} element
// @param {module:engine/model/writer~Writer} writer
// @param {module:engine/model/model~Model} model
function changeElementToTitle(element, writer, model) {
    const title = writer.createElement('title');

    writer.insert(title, element, 'before');
    writer.insert(element, title, 0);
    writer.rename(element, 'title-content');
    model.schema.removeDisallowedAttributes([element], writer);
}

// Returns true when the last paragraph in the document was created only for the placeholder
// purpose and it's not needed anymore. Returns false otherwise.
//
// @param {module:engine/model/rootelement~RootElement} root
// @param {module:engine/model/element~Element} placeholder
// @returns {Boolean}
function shouldRemoveLastParagraph(placeholder, root) {
    if (!placeholder || !placeholder.is('element', 'paragraph') || placeholder.childCount) {
        return false;
    }

    if (root.childCount <= 2 || root.getChild(root.childCount - 1) !== placeholder) {
        return false;
    }

    return true;
}
