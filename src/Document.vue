<template>
  <html>
  <head>
    <title v-once>{{ count }} => {{ title }}</title>
    <meta v-for="oneMeta in meta" v-bind="oneMeta" v-once />
    <link v-for="oneLink in link" v-bind="oneLink" v-once />
  </head>
  <body v-bind="bodyAttrs" v-once>
  <div id="wrapper" v-html="html" v-once></div>
  <v-script v-for="oneScript in script" v-bind="oneScript" v-once />
  </body>
  </html>
</template>

<script>
import VScript from './components/VScript.js';

export default {
  inject: {
    html: {
      from: 'html', // this is optional if using the same key for injection
      default: '<span style="font-weight:bold;color:red!important;">HTML PARAM NOT PASSED</span>',
    },
  },

  components: {
    VScript,
  },

  props: {
    title: String,
    htmlAttrs: Object,
    bodyAttrs: Object,
  },

  data: () => ({
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        contents: 'width=device-width, initial-scale=1, user-scalable=no',
      },
      {
        name: 'robots',
        contents: 'noindex',
      },
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'assets/css/main.css',
      },
    ],
    script: [
      {
        type: 'text/javascript',
        src: 'client.js',
      },
    ],
  }),
};
</script>
