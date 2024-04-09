<script setup>
import { QItem, QItemSection } from "quasar";
import { useAttrs } from "vue";
const props = defineProps({
  color: { type: [Object, String, Array], required: true },
});
import { useRoute } from "vue-router";
const route = useRoute();
const attrs = useAttrs();

const isActive = (nameOrPath, exact = true) => {
  if (!nameOrPath) return;
  if (exact) {
    return route.name === nameOrPath || route.path === nameOrPath;
  }
  return route.matched.some(
    (item) => item.name === nameOrPath || item.path === nameOrPath
  );
};
</script>

<template>
  <QItem
    exact
    class="admin-item-nav"
    :class="[color]"
    v-bind="{
      ...($attrs.to ? { to: $attrs.to } : {}),
    }"
    v-ripple
  >
    <QItemSection avatar v-if="$attrs.icon">
      <QIcon
        size="1.2rem"
        :name="
          isActive($attrs?.to?.name || $attrs?.to?.path || $attrs.to)
            ? $attrs.activeIcon || $attrs.icon
            : $attrs.icon
        "
      ></QIcon>
    </QItemSection>
    <QItemSection>
      <slot>
        <!-- <span v-if="$attrs.moduleName">{{
          $mt($attrs.moduleName, $attrs.title)
        }}</span>
        <span v-else> {{ $mt("app", $attrs.title) }}</span> -->
        <span> {{ $attrs.title }}</span>
      </slot>
    </QItemSection>
  </QItem>
</template>
