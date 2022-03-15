import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import {toWidget, toWidgetEditable} from '@ckeditor/ckeditor5-widget/src/utils';
import {
    getClosestTypeAroundDomButton,
    getClosestWidgetViewElement,
    getTypeAroundButtonPosition
} from "@ckeditor/ckeditor5-widget/src/widgettypearound/utils.js";
import InsertPostCommand from "./command/insertpostcommand.js";

/**
 * @typedef {import('@ckeditor/ckeditor5-engine/src/model/node').default} CKNode
 * @typedef {import('@ckeditor/ckeditor5-engine/src/model/element').default} CKElement
 * @typedef {import('@ckeditor/ckeditor5-widget/src/widgettypearound/widgettypearound').default} WidgetTypeAround
 */

/**
 * <post-ruler/>                    |   <hr/>
 * <post>                           |   <article class="post">
 *     <post-header>                |       <header>
 *         <post-title>             |           <div class="title">
 *             $text                |               ...
 *         </post-title>            |           </div>
 *         <post-meta>              |           <div class="meta">
 *             <post-meta-div1>     |               <div>
 *                 _static_content  |                   _static_content
 *             </post-meta-div1>    |               </div>
 *             <post-meta-div2>     |               <div>
 *                 $text            |                   ...
 *             </post-meta-div2>    |               </div>
 *         </post-meta>             |           </div>
 *     </post-header>               |       </header>
 *     <post-text>                  |       <p>
 *         $text                    |           ...
 *     </post-text>                 |       </p>
 * </post>                          |   </article>
 */
export default class PostEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        console.log('SimpleBoxEditing#init() got called');

        this._defineSchema();
        this._defineConverters();
        this._definePostFixers();

        this.editor.commands.add('insertPost', new InsertPostCommand(this.editor));
        this._overrideWidget();
    }

    _overrideWidget() {
        // console.log(this);
        // console.log(this.editor.plugins);
        // console.log(this.editor.plugins.get('WidgetTypeAround'));

        /** @type {Editor} */
        const editor = this.editor;
        /** @type {View} */
        const editingView = editor.editing.view;
        /** @type {WidgetTypeAround} */
        const widgetTypeAround = editor.plugins.get('WidgetTypeAround');

        (function () {
            // WidgetTypeAround context

            function _insertPost(widgetModelElement, position) {
                editor.execute('insertPost', {
                    position: editor.model.createPositionAt(widgetModelElement, position)
                });

                editingView.focus();
                editingView.scrollToTheSelection();
            }

            this._listenToIfEnabled(editingView.document, 'mousedown', (evt, domEventData) => {
                const button = getClosestTypeAroundDomButton(domEventData.domTarget);

                if (!button) {
                    return;
                }

                const buttonPosition = getTypeAroundButtonPosition(button);
                const widgetViewElement = getClosestWidgetViewElement(button, editingView.domConverter);
                const widgetModelElement = editor.editing.mapper.toModelElement(widgetViewElement);

                _insertPost(widgetModelElement, buttonPosition);

                domEventData.preventDefault();
                evt.stop();
            }, {
                priority: 'high'
            });
        }).call(widgetTypeAround);
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('post-ruler', {
            isSelectable: false,
            allowIn: '$root',
        });

        schema.register('post', {
            isObject: true,
            allowIn: '$root',
        });

        schema.register('post-header', {
            isObject: true,
            allowIn: 'post',
        });
        schema.register('post-title', {
            isLimit: true,
            allowIn: 'post-header',
            allowContentOf: '$root',
        });
        schema.register('post-meta', {
            isLimit: true,
            allowIn: 'post-header',
        });
        schema.register('post-meta-div1', {
            isLimit: true,
            allowIn: 'post-meta',
            allowContentOf: '$text',
        });
        schema.register('post-meta-div2', {
            isLimit: true,
            allowIn: 'post-meta',
            allowContentOf: '$block',
        });

        schema.register('post-text', {
            isBlock: true,
            isLimit: true,
            allowIn: 'post',
            allowContentOf: '$block',
        });
        // schema.extend('$text', {
        //     allowIn: 'post-text',
        //     isInline: true,
        // });

        // schema.register('post-footer', {
        //     isObject: true,
        //     allowWhere: 'post',
        //     allowContentOf: '$root',
        // });

        // ----

        // schema.register('simpleBoxTitle', {
        //     // Cannot be split or left by the caret.
        //     isLimit: true,
        //
        //     allowIn: 'simpleBox',
        //
        //     // Allow content which is allowed in blocks (i.e. text with attributes).
        //     allowContentOf: '$block'
        // });
        //
        // schema.register('simpleBoxDescription', {
        //     // Cannot be split or left by the caret.
        //     isLimit: true,
        //
        //     allowIn: 'simpleBox',
        //
        //     // Allow content which is allowed in the root (e.g. paragraphs).
        //     allowContentOf: '$root'
        // });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        // <post-ruler> converters
        conversion.elementToElement({
            model: 'post-ruler',
            view: {
                name: 'hr',
                classes: ['post--pre', 'bg'],
            },
        });

        // <post> converters
        const postConfig = {
            model: 'post',
            view: {
                name: 'article',
                classes: 'post'
            }
        };
        conversion.for('upcast').elementToElement(postConfig);
        conversion.for('dataDowncast').elementToElement(postConfig);
        // conversion.for('dataDowncast').elementToStructure({
        //     model: 'post',
        //     view: (modelElement, {writer: viewWriter}) => {
        //         const hr = viewWriter.createEmptyElement('hr', {class: 'bg'});
        //
        //         const article = viewWriter.createContainerElement('article', {class: 'post'}, [
        //             viewWriter.createSlot()
        //         ]);
        //         // const articlePosition = viewWriter.createPositionAt(article, 'end');
        //
        //         return viewWriter.createDocumentFragment([
        //             article, hr
        //         ]);
        //     }
        // });
        conversion.for('editingDowncast').elementToElement({
            model: 'post',
            view: (modelElement, {writer}) => {
                const article = writer.createContainerElement('article', {class: 'post'});

                return toWidget(article, writer);
            }
        });

        // <post-header> converters
        conversion.elementToElement({
            model: 'post-header',
            view: 'header',
        });

        // <post-title> converters
        const postTitleConfig = {
            model: 'post-title',
            view: {
                name: 'div',
                classes: 'title'
            }
        };
        conversion.for('upcast').elementToElement(postTitleConfig);
        conversion.for('dataDowncast').elementToElement(postTitleConfig);
        conversion.for('editingDowncast').elementToElement({
            model: 'post-title',
            view: (modelElement, {writer}) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = writer.createEditableElement('div', {class: 'title'});

                return toWidgetEditable(div, writer);
            }
        });

        // <post-meta> converters
        conversion.elementToElement({
            model: 'post-meta',
            view: {
                name: 'div',
                classes: 'meta',
            }
        });
        conversion.for('upcast').elementToElement({
            model: 'post-meta-div1',
            view: {
                name: 'div',
                classes: 'meta--1',
            },
        });
        conversion.for('downcast').elementToStructure({
            model: 'post-meta-div1',
            view: (modelElement, {writer}) => {
                return writer.createRawElement('div', {class: 'meta--1'}, function (domElement) {
                    domElement.innerHTML = '<span>Status</span><br/><span>Est.</span>';
                });

                // return writer.createContainerElement('div', {class: 'meta--1'}, [
                //     writer.createContainerElement('span', {}, [writer.createText('Status')]),
                //     writer.createEmptyElement('br'),
                //     writer.createContainerElement('span', {}, [writer.createText('Est.')]),
                // ]);
            }
        });
        const postMetaDiv2Config = {
            model: 'post-meta-div2',
            view: {
                name: 'div',
                classes: 'meta--2',
            }
        };
        conversion.for('upcast').elementToElement(postMetaDiv2Config);
        conversion.for('dataDowncast').elementToElement(postMetaDiv2Config);
        conversion.for('editingDowncast').elementToElement({
            model: 'post-meta-div2',
            view: (modelElement, {writer}) => {
                const div = writer.createEditableElement('div', {class: 'meta--2'});

                return toWidgetEditable(div, writer);

                // const divMeta = viewWriter.createContainerElement('div', {class: 'meta'});
                // const divMetaPos = viewWriter.createPositionAt(divMeta, 'end');
                //
                // const div1 = viewWriter.createContainerElement('div');
                // viewWriter.insert(divMetaPos, div1);
                //
                // // Note: You use a more specialized createEditableElement() method here.
                // const div2 = toWidgetEditable(viewWriter.createEditableElement('div'), viewWriter);
                // viewWriter.insert(divMetaPos, div2);
                //
                // return divMeta;
            }
        });

        // <post-text> converters
        const postTextConfig = {
            model: 'post-text',
            view: 'p',
        };
        conversion.for('upcast').elementToElement(postTextConfig);
        conversion.for('dataDowncast').elementToElement(postTextConfig);
        conversion.for('editingDowncast').elementToElement({
            model: 'post-text',
            view: (modelElement, {writer}) => {
                // Note: You use a more specialized createEditableElement() method here.
                const div = writer.createEditableElement('p');

                return toWidgetEditable(div, writer);
            }
        });

        // conversion.elementToElement({
        //     model: 'post-footer',
        //     view: 'footer',
        // });
    }

    _definePostFixers() {
        const {model} = this.editor;

        // Take care about correct `header` element structure.
        model.document.registerPostFixer(writer => {
            /** @type {CKNode[]|CKElement[]} */
            const children = [...this.editor.model.document.getRoot().getChildren()];
            let somethingChanged = false;

            for (let i in children) {
                if (children[i].name === 'post' && children[i - 1].name !== 'post-ruler') {
                    writer.insertElement('post-ruler', {class: 'post--pre bg'}, children[i], 'before');
                    somethingChanged = true;
                }
            }

            return somethingChanged;
        });
    }
}
