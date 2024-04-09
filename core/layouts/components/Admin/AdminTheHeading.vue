<script setup>
import { useVModel } from "@vueuse/core";
import LanguageSelector from "src/modules/core/layouts/components/global/LanguageSelector.vue";
import { useCoreStore } from "src/modules/core/stores/coreStore";
import { watchEffect } from "vue";

const props = defineProps({
  lockMini: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits(["update:lockMini"]);
const lockMini = useVModel(props, "lockMini", emits);

const coreStore = useCoreStore();
const toggleMiniDrawer = () => {
  lockMini.value = !lockMini.value;
};
watchEffect(() => {
  coreStore.setThemeConfig("isLockMiniDrawer", lockMini.value);
});
</script>
<template>
  <QHeader reveal bordered class="bg-white text-secondary">
    <QToolbar>
      <div class="flex items-center justify-between full-width">
        <div class="flex items-center gap-sm">
          <QBtn
            @click="toggleMiniDrawer"
            class="cursor-pointer"
            flat
            round
            dense
          >
            <QIcon
              :color="lockMini ? 'primary' : 'grey-8'"
              size="1.1rem"
              name="fa-solid fa-circle-dot"
            />
          </QBtn>
          <QAvatar size="2rem">
            <img src="/img/logo.png" alt="" />
          </QAvatar>
        </div>
        <LanguageSelector v-if="$i18n" />
      </div>
    </QToolbar>
  </QHeader>
</template>
