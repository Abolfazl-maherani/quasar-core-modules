<template>
  <QExpansionItem
    icon="fa-solid fa-chevron-down"
    exact
    :content-inset-level="0.3"
    v-bind="$attrs"
    :label="$attrs.title"
  >
    <template v-if="$attrs?.children">
      <template :key="child" v-for="child in $attrs?.children">
        <NavigationItemVerticalGroup
          mamad="hello"
          :header-inset-level="1"
          v-if="child?.children"
          v-bind="child"
        />

        <NavigationItemVerticalLink
          :class="classLink"
          v-bind="{ ...child, ...attrLink }"
          v-else
        />
      </template>
    </template>
  </QExpansionItem>
</template>
<script setup>
import { computed, useAttrs } from "vue";
import NavigationItemVerticalLink from "src/modules/core/layouts/components/global/NavigationItemVerticalLink.vue";
defineOptions({
  name: "RecursiveNavigationVerticalGroup",
});
const props = defineProps({
  classLink: {
    type: [String, Array, Object],
    default: "",
  },
  attrLink: {
    type: Object,
    default: () => ({}),
  },
});
const attr = useAttrs();
</script>
