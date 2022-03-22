import {defineComponent, h} from 'vue';

export default defineComponent({
  inheritAttrs: true,

  render: function() {
    return h('script', this.$attrs);
  },
});
