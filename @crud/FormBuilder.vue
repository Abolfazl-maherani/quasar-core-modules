<script setup>
import { useVModel } from "@vueuse/core";
import { computed, ref, shallowRef, toRaw } from "vue";
import { useCrudStore } from "src/modules/core/@crud/stores/crudStore";
import { QDate, QInput, QSelect } from "quasar";
const crudStore = useCrudStore();

const props = defineProps({
  inlineAction: Boolean,
  formAttr: {
    type: Object,
    default: () => ({}),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  responsiveColClass: {
    type: Array,
    default: () => [],
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Object,
    required: true,
  },
  spaceBetween: {
    type: String,
    default: "q-px-sm",
  },
  inputProp:{
    type:Object,
    default:()=>({})
  },
  responsiveItemClass: {
    type: String,
    default: "col-xs-12 col-sm-4 col-md-2 ",
  },

  formStructure: {
    type: Array,
    default: () => [],
  },
  submitText: {
    type: String,
    default: "submit",
  },
});
const emits = defineEmits(["update:modelValue", "submit"]);
const modelValue = useVModel(props, "modelValue", emits);
const form = ref();
const inputProps = computed(() => ({
  // outlined: true,
  // dense: true,
  clearable: true,
  ...props.inputProp
}));
const submitHandler = () => {
  form.value.validate();
  if (!form.value.hasError) {
    emits("submit");
  }
};
const generateSpecifyPropsInput = (type, fields) => {
  switch (type) {
    case "select":
    case "checkbox":
      return {
        options: fields?.options || [],
        "map-options": true,
        "emit-value": true,
      };
    case "input":
      return {};
  }
};
const generateValidationObj = computed(() => ({
  required(message = "") {
    return (v) => {
      return (
        ![undefined, null, ""].includes(v) ||
        message ||
        "this field cannot be blank"
      );
    };
  },
}));

const generateValidate = ({ field }) => {
  const supportValidations = ["required"];
  const validations = [];

  Object.keys(field?.rules || {}).forEach((item) => {
    if (supportValidations.includes(item)) {
      validations.push(
        generateValidationObj.value[item](
          field.rules[item].message?.replace("{attribute}", field?.label)
        )
      );
    }
  });

  return validations;
};

const selectBox = shallowRef(crudStore.selectBoxInputComponent);
const textarea = shallowRef(crudStore.textareaInputComponent);
const textBox = shallowRef(crudStore.textInputComponent);
const dateInput = shallowRef(crudStore.dateTimeInputComponent);
const getComponentInput = (type) => {
  switch (type) {
    case "select":
      return selectBox.value || QSelect;
    case "input":
      return textBox.value || QInput;
    case "textarea":
      return textarea.value || QInput;
    //Need to component
    case "datetime":
      return dateInput.value || QDate;
    // case 'checkbox':
    //   return Checkbox
  }
};
</script>
<template>
  <QForm
    class="full-width"
    ref="form"
    v-bind="formAttr"
    @submit.prevent="submitHandler"
  >
    <div class="row" v-if="formStructure.length && !isLoading">
      <div
        :class="
          responsiveColClass?.length ? responsiveColClass[index] : 'col-12'
        "
        v-for="(formCol, index) in formStructure"
        :key="index"
      >
        <div class="row q-col-gutter-sm">
          <template v-for="field in formCol">
            <slot
              v-if="Object.keys($slots).includes(field.name)"
              v-bind="{
                props: {},
                field,

                inputProps: {
                  required: field.required,
                  rules: generateValidate(field),
                  label: field.label,
                  ...inputProps,
                  ...generateSpecifyPropsInput(field.type, field.field),
                  class: [
                    field.class || responsiveItemClass,
                    'input-rtl',
                    spaceBetween,
                  ],
                },
              }"
              :name="field.name"
            />

            <div
              v-else
              :key="field.name"
              :class="[field.class || responsiveItemClass, spaceBetween]"
            >
              <component
                :required="field.required"
                :key="field.name"
                :is="getComponentInput(field.type)"
                :rules="generateValidate(field)"
                v-bind="{
                  ...field,
                  ...(field?.attr || {}),
                  ...generateSpecifyPropsInput(field.type, field.field),
                  ...inputProps,
                }"

                v-model="modelValue[field.name]"
                class="input-rtl"
                :read-only="readOnly"
              />
            </div>
            <!-- Add more conditionals for other input types -->
          </template>
          <slot
            :responsive-item-class="responsiveItemClass"
            v-if="inlineAction && index === formStructure.length - 1"
            name="action"
          >
            <div class="col-12">
              <div class="row justify-end">
                <QBtn :label="submitText" type="submit" />
              </div>
            </div>
          </slot>
        </div>
      </div>
      <slot v-if="!inlineAction" name="action">
        <div
          :class="responsiveColClass?.[formStructure.length - 1] || 'col-12'"
        >
          <QBtn class="full-width" :label="submitText" type="submit" />
        </div>
      </slot>
    </div>
    <div class="row q-col-gutter-md" v-else>
      <div class="col-12 col-md-3" v-for="i in 8" :key="i">
        <QSkeleton height="30px" type="QInput" />
      </div>
    </div>
  </QForm>
</template>
