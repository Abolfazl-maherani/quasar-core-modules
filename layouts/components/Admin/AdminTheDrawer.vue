<script setup>
import { reactive, ref, toRef, watch, watchEffect } from "vue";
import { useTimeoutFn, useVModel } from "@vueuse/core";
import TheNavigation from "src/modules/core/layouts/components/global/TheNavigation.vue";
import adminNavItems from "src/modules/app/navigations/vertical/admin";
const props = defineProps({
  isLockMini: {
    type: Boolean,
    required: true,
  },
});

const data = reactive({
  isMini: true,
});

const {
  stop: stopEnterMouse,
  start: startEnterMouse,
  isPending: isPendingEnterMouse,
} = useTimeoutFn(
  () => {
    data.isMini = false;
  },
  50,
  { immediate: false }
);
const {
  stop: stopOutMouse,
  start: startOutMouse,
  isPending: isPendingOutMouse,
} = useTimeoutFn(
  () => {
    if (!props.isLockMini) data.isMini = true;
  },
  200,
  { immediate: false }
);
const mouseEnterHandler = () => {
  if (isPendingOutMouse.value) {
    stopOutMouse?.();
  }
  startEnterMouse?.();
};
const mouseLeaveHandler = () => {
  if (isPendingEnterMouse.value) {
    stopEnterMouse?.();
  }
  startOutMouse?.();
};
watchEffect(() => {
  data.isMini = !props.isLockMini;
});
</script>
<template>
  <QDrawer
    @mouseover="mouseEnterHandler"
    @mouseout="mouseLeaveHandler"
    :model-value="true"
    show-if-above
    class="admin-drawer"
    :mini="data.isMini"
    :width="250"
  >
    <TheNavigation
      mode="vertical"
      class="text-white"
      :nav-items="adminNavItems"
    />
    <!-- drawer content -->
  </QDrawer>
</template>
<style lang="scss" scoped>
@import "src/modules/core/css/variables";
:deep(.admin-drawer) {
  background: $admin-drawer-bg;
}
</style>
