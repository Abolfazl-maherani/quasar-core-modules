<script setup>
import { useVModel } from "@vueuse/core";
const props = defineProps({
  modelValue: Boolean,
  selected: [Array, Object],
  isLoading: Boolean,
});

const emits = defineEmits([
  "update:modelValue",
  "update:selected",
  "delete",
  "apply",
]);
const modelValue = useVModel(props, "modelValue", emits);
const selected = useVModel(props, "selected", emits);
</script>
<template>
  <QDialog v-model="modelValue" persistent>
    <QCard bordered flat class="full-width">
      <QCardSection
        class="card-header bg-orange text-white row justify-between"
      >
        <div class="text-bold">
          {{ $mt("core", "With selected") }} ({{ selected.length }}
          {{ $mt("core", "Items") }})
        </div>
      </QCardSection>

      <QSeparator inset />
      <QCardSection class="card-body">
        <div class="row">
          <slot name="batch-body" :selected="selected" />
        </div>
      </QCardSection>

      <QSeparator inset />

      <QCardSection class="card-footer">
        <div class="row justify-between">
          <div class="col-xs-12 col-sm-3 q-pa-sm">
            <QBtn
              color="negative"
              class="full-width"
              :label="$mt('core', 'Delete')"
              :disable="isLoading"
              @click="$emit('delete')"
            />
          </div>
          <div class="col-xs-12 col-sm-3 q-pa-sm">
            <QBtn
              :label="$mt('core', 'Apply')"
              color="orange"
              class="full-width"
              :disable="isLoading"
              @click="$emit('apply')"
            />
          </div>

          <div class="col-xs-12 col-sm-3 q-pa-sm">
            <QBtn
              :label="$mt('core', 'Close')"
              color="primary"
              v-close-popup
              class="full-width"
            />
          </div>
        </div>
      </QCardSection>
    </QCard>
  </QDialog>
</template>
