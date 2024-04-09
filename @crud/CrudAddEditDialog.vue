<script setup>
import { useVModel } from "@vueuse/core";
import { computed, useAttrs } from "vue";
import { mt } from "src/modules/core/boot/i18n";
import CrudForm from "src/modules/core/@crud/CrudForm.vue";
const emits = defineEmits(["updateModelValue", "dataFetched", "fieldFetched"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  formStructure: {
    type: Array,
    required: true,
  },
});
const attr = useAttrs();
const modelValue = useVModel(props, "modelValue", emits);
const isEditDialog = computed(() => {
  return !!attr?.id;
});
const generateTitleDialog = computed(() =>
  isEditDialog.value
    ? mt("core", "General.Edit Form")
    : mt("core", "General.Add Form")
);
defineOptions({
  inheritAttrs: false,
});
</script>
<template>
  <QDialog v-model="modelValue">
    <QCard class="bg-white" flat style="width: 700px; max-width: 80vw">
      <QCardSection>
        <CrudForm
          dialog-mode
          :module-name="$attrs.moduleName"
          :subject="$attrs.subject"
          :role="$attrs.role"
          @field-fetched="emits('fieldFetched', $event)"
          @data-fetched="emits('dataFetched', $event)"
          v-bind="{ ...$attrs }"
          :form-structure="formStructure"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="slotProps">
            <slot
              :name="slot"
              v-bind="{ ...slotProps, editMode: isEditDialog }"
            />
          </template>
        </CrudForm>
      </QCardSection>
    </QCard>
  </QDialog>
</template>
