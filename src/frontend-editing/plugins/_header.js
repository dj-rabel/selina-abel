import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import { toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';

import { getMarkerAtPosition } from "./header/utils";

export default class Header extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        console.debug('Header#init() got called');

        this._defineSchema();
        this._defineConverters();

        // this.listenTo(this.editor.model, 'deleteContent', this._preventDeleteContent.bind(this), {priority: 'high'});
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('header', {
            isBlock: true,
            isObject: true,
            isSelectable: false,

            // Allow in places where other blocks are allowed (e.g. directly in the root).
            allowWhere: '$block',

            // Allow content which is allowed in the root (e.g. paragraphs).
            allowContentOf: '$root',
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        // conversion.elementToElement({
        //     model: 'header',
        //     view: {
        //         name: 'header',
        //         classes: ''
        //     }
        // });

        conversion.for( 'upcast' ).elementToElement( {
            model: 'header',
            view: {
                name: 'header',
                classes: ''
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'header',
            view: {
                name: 'header',
                classes: ''
            }
        } );
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'header',
            view: ( modelElement, { writer: viewWriter } ) => {
                const header = viewWriter.createEditableElement( 'header', { placeholder: 'Hellooo' } );

                return toWidgetEditable( header, viewWriter );
            }
        } );
    }

    /**
     * @private
     */
    _preventDeleteContent(evt, args) {
        console.debug('Events::deleteContent() got caught', evt, args);

        const [selection] = args;

        const marker = getMarkerAtPosition(editor, selection.focus) || getMarkerAtPosition(editor, selection.anchor);

        // Stop method execution if marker was not found at selection focus.
        if (!marker) {
            evt.stop();

            return;
        }

        // Collapsed selection inside exception marker does not require fixing.
        if (selection.isCollapsed) {
            return;
        }

        // Shrink the selection to the range inside exception marker.
        const allowedToDelete = marker.getRange().getIntersection(selection.getFirstRange());

        // Some features uses selection passed to model.deleteContent() to set the selection afterwards. For this we need to properly modify
        // either the document selection using change block...
        if (selection.is('documentSelection')) {
            editor.model.change(writer => {
                writer.setSelection(allowedToDelete);
            });
        }
        // ... or by modifying passed selection instance directly.
        else {
            selection.setTo(allowedToDelete);
        }
    }

    /**
     * @param {string} method
     * @param {array} additionalArguments
     * @return {function(): *}
     * @private
     */
    _proxy(method, additionalArguments = []) {
        return (...args) => {
            return this[method](args.concat(additionalArguments));
        }
    }
}
