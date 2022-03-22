<template>
  <head>
    <meta v-for="oneMeta in this.meta" v-bind="oneMeta" />
    <link v-for="oneLink in this.link" v-bind="oneLink" />
    <script v-for="oneScript in this.script" v-bind="oneScript" />
  </head>
</template>

<script>
export default {
  props: {
    link: Array,
    meta: Array,
    script: Array,
  },
};
</script>
