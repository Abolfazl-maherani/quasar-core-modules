<script setup>
import { computed, useAttrs } from "vue";

const attrs = useAttrs();
import { QBtn, QBtnDropdown } from "quasar";

const generateComponent = computed(() => {
  if (attrs?.children) return QBtnDropdown;
  return QBtn;
});
const props = defineProps({
  color: {
    type: String,
    default: "body",
  },
});
</script>
<template>
  <component
    :is="generateComponent"
    :text-color="color"
    size=".8rem"
    v-bind="$attrs"
  >
    <span class="nav-btn-text">
      <slot>
        <span v-if="$attrs.moduleName">{{
          $mt($attrs.moduleName, $attrs.title)
        }}</span>
        <span v-else> {{ $mt("app", $attrs.title) }}</span>
      </slot>
    </span>
  </component>
</template>
