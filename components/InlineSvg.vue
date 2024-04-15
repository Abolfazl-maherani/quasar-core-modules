<script setup>
import { defineAsyncComponent } from "vue";

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
});

/* @vite-ignore */
const icon = defineAsyncComponent(() => import(`../../../../${props.path}`));
</script>

<template>
  <component :is="icon" />
</template>
