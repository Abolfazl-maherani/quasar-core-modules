<template>
  <QBtn
    :icon="icon"
    :color="arrayOfTypesVariant.includes(type) ? `${type}-variant` : 'primary'"
    :text-color="type"
    dense
    padding="5px"
    unelevated
    v-bind="$attrs"
    size="sm"
  >
    <slot></slot>
  </QBtn>
</template>
<script setup>
const arrayOfTypesVariant = ["positive", "negative", "warning"];
const props = defineProps({
  icon: { type: String, required: true },
  type: {
    type: String,
    default: "normal", //positive, negative, warning
  },
});

defineOptions({
  inheritAttrs: false,
});
</script>
