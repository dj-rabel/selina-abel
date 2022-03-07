'use strict';

/**
 * @see https://ckeditor.com/docs/ckeditor5/latest/api/
 */

import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor';
// import { BlockToolbar } from '@ckeditor/ckeditor5-ui';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Title from '@ckeditor/ckeditor5-heading/src/title';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Header from './plugins/header';
// import Header from './plugins/_header';

BalloonEditor
    .create(document.querySelector('.contenteditable'), {
        plugins: [
            Essentials,
            Header,
            // Heading,
            Paragraph,
            List,
            Bold,
            Italic
        ],
        toolbar: ['bold', 'italic', 'numberedList', 'bulletedList'],
        blockToolbar: ['heading', 'paragraph', 'heading1', 'heading2', 'bulletedList', 'numberedList'],
    })
    .then(editor => {
        console.debug('Editor was initialized', editor);

        // Expose for playing in the console.
        window.editor = editor;
    })
    .catch(error => {
        console.error(error.stack);
    });
