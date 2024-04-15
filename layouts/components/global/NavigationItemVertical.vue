<script setup>
import { computed, useAttrs } from "vue";
import { QExpansionItem, QItem, QItemSection } from "quasar";
import NavigationItemVerticalLink from "src/modules/core/layouts/components/global/NavigationItemVerticalLink.vue";
import NavigationItemVerticalGroup from "src/modules/core/layouts/components/global/NavigationItemVerticalGroup.vue";

const attrs = useAttrs();
const hasChild = computed(() => {
  return !!attrs?.children;
});

const props = defineProps({
  color: {
    type: String,
    default: "white",
  },
});
const generateColor = computed(() => `text-${props.color}`);
</script>
<template>
  <NavigationItemVerticalLink
    v-bind="$attrs"
    :color="generateColor"
    v-if="!hasChild"
    dense
    class="q-py-sm q-my-sm"
  />
  <NavigationItemVerticalGroup
    dense
    class="q-my-sm"
    header-class="q-py-sm"
    v-bind="$attrs"
    :color="generateColor"
    v-else
    class-link="q-py-sm q-my-sm"
    :attr-link="{
      dense: true,
    }"
  />
</template>
<style lang="scss">
@import "src/modules/core/css/variables";

.admin-item-nav.QItem.q-router-link--active,
.admin-item-nav.QItem--active {
  color: $admin-item-nav-active-color;
}
</style>
