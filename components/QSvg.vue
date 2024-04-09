<script setup>
import { useAttrs } from "vue";
import InlineSvg from "./InlineSvg.vue";
const attrs = useAttrs();

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  ratio: {
    type: [String, Number],
    default: 1,
  },
});
</script>

<template>
  <QImg :ratio="props.ratio">
    <InlineSvg :path="props.src" />
  </QImg>
</template>
