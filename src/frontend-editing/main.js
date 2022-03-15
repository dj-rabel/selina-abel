'use strict';

/**
 * @see https://ckeditor.com/docs/ckeditor5/latest/api/
 */

import {BalloonEditor} from '@ckeditor/ckeditor5-editor-balloon';
import {BlockToolbar} from '@ckeditor/ckeditor5-ui';
import {Essentials} from '@ckeditor/ckeditor5-essentials';
import Header from './plugins/header';
import Post from './plugins/post';

import {Paragraph, ParagraphButtonUI} from '@ckeditor/ckeditor5-paragraph';
import {Heading, HeadingButtonsUI} from '@ckeditor/ckeditor5-heading';
import {List} from '@ckeditor/ckeditor5-list';
import {BlockQuote} from '@ckeditor/ckeditor5-block-quote';

import {Bold, Italic, Strikethrough, Subscript, Superscript, Underline} from '@ckeditor/ckeditor5-basic-styles';
import {AutoLink, Link} from '@ckeditor/ckeditor5-link';

import _ from 'lodash-es';

window.editors = [];

document.querySelectorAll('#me .contenteditable, #education .contenteditable, #curriculum-vitae .contenteditable')
    .forEach(elem => {
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
                    BlockQuote,
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
                blockToolbar: ['paragraph', 'heading3', 'heading4', 'numberedList', 'bulletedList', 'blockQuote', 'undo', 'redo']
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
    .create(document.querySelector('#publications .contenteditable'), {
        plugins: [
            // BlockToolbar,
            Header,
            Post,
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
        heading: {
            options: [
                {model: 'paragraph', title: 'Paragraph'},
                {model: 'heading3', view: 'h3', title: 'Heading'},
            ],
        },
        toolbar: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'link'],
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

BalloonEditor
    .create(document.querySelector('aside .contenteditable'), {
        plugins: [
            // BlockToolbar,
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
