'use strict';

/**
 * @see https://ckeditor.com/docs/ckeditor5/latest/api/
 */

import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
import { BlockToolbar } from '@ckeditor/ckeditor5-ui';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Title from '@ckeditor/ckeditor5-heading/src/title';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Underline from '@ckeditor/ckeditor5-basic-styles/src/underline';
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import Header from './plugins/header';
// import Header from './plugins/_header';

BalloonEditor
    .create(document.querySelector('#me .contenteditable'), {
        plugins: [
            Essentials,
            Header,
            Heading,
            Paragraph,
            List,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript
        ],
        toolbar: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'link', 'undo', 'redo', 'numberedList', 'bulletedList'],
    })
    .then(editor => {
        console.debug('Editor was initialized', editor);

        // Expose for playing in the console.
        window.editor = editor;
    })
    .catch(error => {
        console.error(error.stack);
    });

BalloonEditor
    .create(document.querySelector('#education .contenteditable'), {
        plugins: [
            BlockToolbar,
            Essentials,
            Heading,
            Paragraph,
            List,
            Bold,
            Italic,
            Underline,
            Strikethrough,
            Subscript,
            Superscript
        ],
        toolbar: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'link', 'undo', 'redo'],
        blockToolbar: ['heading', 'numberedList', 'bulletedList']
    })
    .then(editor => {
        console.debug('Editor was initialized', editor);

        // Expose for playing in the console.
        window.editor = editor;
    })
    .catch(error => {
        console.error(error.stack);
    });
