<script setup>
import NavigationItemHorizontal from "src/modules/core/layouts/components/global/NavigationItemHorizontal.vue";
import { computed } from "vue";
import NavigationItemVertical from "src/modules/core/layouts/components/global/NavigationItemVertical.vue";

const props = defineProps({
  navItems: {
    type: Array,
    default: () => [],
  },
  color: {
    type: String,
    default: "white",
  },
  // navItems: Array,
  attrNavItem: {
    type: Object,
    default: () => {},
  },
  moduleName: {
    type: String,
    default: "core",
  },
  mode: {
    type: String,
    default: "horizontal",
  },
});

const isHorizontal = computed(() => props.mode === "horizontal");
</script>

<template>
  <QToolbar v-if="isHorizontal">
    <div class="col-12 flex">
      <QBtnGroup spread flat unelevated class="full-width bg-transparent">
        <slot name="before-nav-item" :props="attrNavItem" />
        <NavigationItemHorizontal
          :color="color"
          v-for="(nav, index) in navItems"
          :key="index"
          v-bind="{ ...nav, ...attrNavItem, moduleName }"
        />
        <slot name="after-nav-item" :props="attrNavItem" />
      </QBtnGroup>
    </div>
  </QToolbar>
  <QList v-else class="q-py-sm">
    <slot name="before-nav-item"></slot>
    <NavigationItemVertical
      :color="color"
      v-for="(nav, index) in navItems"
      :key="index"
      v-bind="{ ...nav, ...attrNavItem, moduleName }"
    />
    <slot name="after-nav-item"></slot>
  </QList>
</template>
