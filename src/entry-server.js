'use strict';

import { createApp } from './app.js';
import { renderToString } from 'vue/server-renderer';
import { createSSRApp } from 'vue';
import Document from './Document.vue';

function createDocumentApp(/** @type {string} */html) {
  const docApp = createSSRApp(Document);

  docApp.provide('html', html);

  return docApp;
}

export async function render(url, manifest) {
  const { app } = createApp();

  // set the router to the desired URL before rendering
  // router.push(url);
  // await router.isReady();

  // passing SSR context object which will be available via useSSRContext()
  // @vitejs/plugin-vue injects code into a component's setup() that registers
  // itself on ctx.modules. After the render, ctx.modules would contain all the
  // components that have been instantiated during this render call.
  const ctx = {};
  const html = await renderToString(app, ctx);

  // create and stringify static html document with app html injected
  const docApp = createDocumentApp(html);

  return { html: await renderToString(docApp)};
}
