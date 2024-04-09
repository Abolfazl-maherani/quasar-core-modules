<script setup>
import { useVModel } from "@vueuse/core";
const props = defineProps({
  modelValue: Boolean,
  callback: {
    type: Function,
    default: () => {},
  },
});
const emits = defineEmits(["update:modelValue"]);
const modelValue = useVModel(props, "modelValue", emits);
</script>
<template>
  <QDialog v-model="modelValue" persistent>
    <QCard class="bg-negative text-white">
      <QCardSection class="row items-center">
        <QAvatar icon="warning" color="negative" text-color="white" />
        <span class="q-ml-sm">{{
          $mt("core", "Are you sure you want to delete this item?")
        }}</span>
      </QCardSection>

      <QCardActions align="right">
        <QBtn flat :label="$mt('core', 'No')" color="white" v-close-popup />
        <QBtn
          flat
          :label="$mt('core', 'Yes')"
          @click="callback"
          color="white"
          v-close-popup
        />
      </QCardActions>
    </QCard>
  </QDialog>
</template>
