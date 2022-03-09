'use strict';

/**
 * @see https://ckeditor.com/docs/ckeditor5/latest/api/
 */

import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
import {BlockToolbar} from '@ckeditor/ckeditor5-ui';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Header from './plugins/header';
import {Heading, HeadingButtonsUI} from '@ckeditor/ckeditor5-heading';
import {Paragraph, ParagraphButtonUI} from '@ckeditor/ckeditor5-paragraph';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import {Link, AutoLink} from '@ckeditor/ckeditor5-link';
import _ from 'lodash-es';

window.editors = [];

document.querySelectorAll('section .contenteditable').forEach(elem => {
    let ckconfig;
    try {
        ckconfig = JSON.parse(elem.dataset['ckconfig'] || '{}');

        if (typeof ckconfig !== 'object') {
            throw 'TypeError: config is no object'
        }
    } catch (e) {
        console.error('JSON.parce failed with error "' + e + '" for element', elem);

        return;
    }

    BalloonEditor
        .create(elem, _.merge({
            plugins: [
                BlockToolbar,
                Header,
                Essentials,
                Heading,
                HeadingButtonsUI,
                Paragraph,
                ParagraphButtonUI,
                List,
                Bold,
                Italic,
                Underline,
                Strikethrough,
                Subscript,
                Superscript,
                Link,
                AutoLink,
            ],
            heading: {
                options: [
                    {model: 'paragraph', title: 'Paragraph'},
                    {model: 'heading3', view: 'h3', title: 'Heading'},
                    {model: 'heading4', view: 'h4', title: 'Subheading'},
                ],
            },
            toolbar: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'link'],
            blockToolbar: ['paragraph', 'heading3', 'heading4', 'numberedList', 'bulletedList', 'undo', 'redo']
        }, ckconfig))
        .then(editor => {
            console.debug('Editor was initialized', editor);

            // Expose for playing in the console.
            window.editors.push(editor);
        })
        .catch(error => {
            console.error(error.stack);
        });
});

BalloonEditor
    .create(document.querySelector('aside .contenteditable'), {
        plugins: [
            BlockToolbar,
            Header,
            Essentials,
            Heading,
            HeadingButtonsUI,
            Paragraph,
            ParagraphButtonUI,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript,
            Link,
            AutoLink,
        ],
        header: {
            enable: false,
        },
        heading: {
            options: [
                {model: 'paragraph', title: 'Paragraph'},
                {model: 'heading3', view: 'h3', title: 'Heading'},
            ],
        },
        toolbar: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'link'],
        blockToolbar: ['paragraph', 'heading3', 'undo', 'redo'],
    })
    .then(editor => {
        console.debug('Editor was initialized', editor);

        editor.ui.view.body._bodyCollectionContainer.classList.add('ckcustom-white');

        // Expose for playing in the console.
        window.editors.push(editor);
    })
    .catch(error => {
        console.error(error.stack);
    });
