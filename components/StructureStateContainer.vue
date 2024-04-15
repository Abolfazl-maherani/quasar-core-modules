<script setup>
import { computed } from "vue";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: [Object, null],
    /*
      code: 404 || 500,
      message: ''
    */
    default: null,
  },
});
const getErrorCode = computed(() => props?.error?.code);
</script>
<template>
  <!-- 👉 Content -->
  <template v-if="!loading && !error">
    <TransitionGroup
      appear
      enter-active-class="animated fadeIn slower"
      leave-active-class="animated fadeOut slower"
    >
      <slot></slot>
    </TransitionGroup>
  </template>

  <!-- 👉 Errors -->
  <!-- <slot v-else-if="[404].includes(getErrorCode)" name="error-404"></slot>
  <slot v-else-if="[500].includes(getErrorCode)" name="error-500"></slot>
  <slot v-else-if="[403].includes(getErrorCode)" name="error-403"></slot>
  <slot
    v-else-if="![403, 500, 404].includes(getErrorCode) && error"
    name="error"
  ></slot> -->

  <slot v-else-if="error" name="error"></slot>

  <!-- 👉 Loading -->
  <slot v-else name="loading"></slot>
</template>
