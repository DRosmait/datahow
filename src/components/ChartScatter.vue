<template>
  <Plotly :data="data" :layout="layout" :display-mode-bar="false"></Plotly>
</template>

<script lang="ts">
import Vue from "vue";
import { Plotly } from "vue-plotly";

export default Vue.extend({
  components: {
    Plotly,
  },

  props: {
    data: {
      required: true,
      type: Array,
    },

    layout: {
      required: true,
      type: Object,
    },
  },
});
</script>
