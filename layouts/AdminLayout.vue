<script setup>
import { reactive, ref } from "vue";
import ThePage from "src/modules/core/layouts/components/ThePage.vue";
import AdminTheFooter from "src/modules/core/layouts/components/Admin/AdminTheFooter.vue";
import AdminTheHeading from "src/modules/core/layouts/components/Admin/AdminTheHeading.vue";
import AdminTheDrawer from "src/modules/core/layouts/components/Admin/AdminTheDrawer.vue";
import { useCoreStore } from "src/modules/core/stores/coreStore";
import { useQuasar } from "quasar";
const coreStore = useCoreStore();
const data = reactive({
  lockMini: coreStore.getThemeConfig?.isLockMiniDrawer || true,
});
</script>

<template>
  <QNoSsr>
    <QLayout view="Lhh lpr LFf">
      <AdminTheHeading v-model:lock-mini="data.lockMini" />

      <AdminTheDrawer :is-lock-mini="data.lockMini" />
      <ThePage class="q-mt-md" />
      <AdminTheFooter />
    </QLayout>
  </QNoSsr>
</template>
<style>
.on-left {
  margin-left: 5px;
}
</style>
