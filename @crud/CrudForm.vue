<script setup>
import FormBuilder from "./FormBuilder.vue";
import {computed, reactive, toRef, useAttrs, watch} from "vue";
import {useCrud} from "/src/modules/core/composables/useCrud";
import {useI18n} from "vue-i18n";
import {useNotify} from "/src/modules/core/composables/useNotify";
import {useRoute, useRouter} from "vue-router";
import {createPermissionName} from "/src/modules/core/composables/usePermission";
import {useCore} from "/src/modules/core/composables/useCore";
import {mt} from "/src/modules/core/boot/i18n";
import {useLoadingState} from "/src/modules/core/composables/useLoadingState";
import {useQuasar} from "quasar";

const props = defineProps({
  id: {
    type: [String, Number],
    default: "",
  },
  dialogMode: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: "admin", // admin, user, site , etc.
  },
  responsiveColClass: {
    type: Array,
    default: () => [],
  },
  formStructure: {
    type: Array,
    default: () => [],
  },
  subject: {
    type: String,
    required: true,
  }, // same controller
  moduleName: {
    type: String,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});
const data = reactive({
  fields: [],
  loading: false,
  data: {},
  createOrEditIsLoading: false,
});
const generateEndpoint = computed(() => {
  return String.prototype.concat(
    props.moduleName,
    "/",
    props.role,
    "/",
    props.subject
  );
});
const {findByAttribute} = useCore();
const {t, locale} = useI18n();
const attr = useAttrs();

const crud = useCrud(generateEndpoint.value);
const generateFormFields = computed(() => {
  if (!data.fields?.length) return [];

  return props.formStructure.map((itemArray) => {
    return itemArray.map((item) => ({
      ...item,
      label:
        findByAttribute(data.fields, item.name)?.label ||
        mt("app", item?.label || ""),
      class: item?.class || attr.responsiveItemClass,
      field: findByAttribute(data.fields, item.name),
      required: Object?.keys(
        findByAttribute(data.fields, item.name)?.rules || {}
      )?.includes("required"),
    }));
  });
});
const isEditMode = computed(() => {
  return !!props.id;
});
const emits = defineEmits(["fieldFetched", "dataFetched"]);
const loading = useLoadingState();
const fetchData = () => {
  if (loading.isLoading.value) return;
  loading.enableLoading();
  crud
    .get(props.id)
    .then((res) => {
      if (res.data) {
        data.data = res.data;
        emits("dataFetched", data.data);
      }
    })
    .finally(() => {
      loading.disableLoading();
    });
};
const {firePositive, fireNegative} = useNotify();
const setupDefaultValue = () => {
  if (isEditMode.value) return;
  if (!data.fields?.length) return;
  data.fields.forEach((item) => {
    if (![null].includes(item.value)) {
      data.data[item.attribute] = item.value;
    }
  });
};
const fetchField = () => {
  crud
    .fields(
      isEditMode.value ? null : "create",
      isEditMode.value ? route.params.id : null
    )
    .then((res) => {
      if (res.data) {
        data.fields = res.data;
        setupDefaultValue();
        emits("fieldFetched", data.fields);
        if (isEditMode.value) {
          fetchData();
        }
      }
    });
};
const $q = useQuasar()
const router = useRouter();
const generateIcon = computed(() => {
  if (!props.dialogMode) {
    return $q.lang.rtl ? 'arrow_back' : 'arrow_forward'
  }
  return 'close'

})
const create = () => {
  return new Promise((resolve, reject) => {
    if (isEditMode.value) return;
    if (data.createOrEditIsLoading) return;
    data.createOrEditIsLoading = true;
    crud
      .create(data.data)
      .then((res) => {
        if (res.data) {
          firePositive(t("Successfully created."));
          router.push({
            name: createPermissionName(
              props.moduleName,
              props.role,
              props.subject,
              "index"
            ),
          });
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {
        data.createOrEditIsLoading = false;
      });
  });
};
const route = useRoute();
const edit = () => {
  return new Promise((resolve, reject) => {
    if (!isEditMode.value) return;

    if (data.createOrEditIsLoading) return;
    data.createOrEditIsLoading = true;
    crud
      .update(route.params.id, data.data)
      .then((res) => {
        if (res.data) {
          firePositive(t("Edited successfully."));
          fetchData();
          resolve(res.data);
        }
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {
        data.createOrEditIsLoading = false;
      });
  });
};
const submitHandler = () => {
  new Promise((resolve, reject) => {
    if (isEditMode.value) {
      edit()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    } else
      create()
        .then((res) => resolve(res))
        .catch((err) => reject(err));
  }).catch((error) => {
    fireNegative(error.response.data.message);
  });
};
defineExpose({
  fields: toRef(data, "fields"),
  data: toRef(data, "data"),
});
fetchField();
watch(
  locale,
  () => {
    fetchField();
  },
  {
    immediate: false,
  }
);
</script>
<template>
  <div>
    <QCard bordered flat>
      <QCardSection class="card-header row justify-between">
        <div class="text-bold">
          {{ isEditMode ? $mt("core", "Update") : $mt("core", "New") }}
        </div>
        <div>
          <QBtn
            v-if="!dialogMode"
            flat
            dense
            color="secondary"
            :icon="generateIcon"
            size="md"
            :to="{
              name: createPermissionName(moduleName, role, subject, 'index'),
            }"
          />
          <QBtn
            v-else
            flat
            dense
            color="secondary"
            :icon="generateIcon"
            size="md"
            v-close-popup
          />
        </div>
      </QCardSection>
      <QCardSection class="card-body">
        <FormBuilder
          :is-loading="data.loading"
          :responsive-col-class="responsiveColClass"
          :form-attr="$attrs.formAttr"
          :responsive-item-class="$attrs?.['responsive-item-class']"
          :submit-text="$attrs.submitText"
          :read-only="readonly"
          :form-structure="generateFormFields"
          v-model="data.data"
          @submit="submitHandler"
          :input-prop="{
            clearable:false
          }"
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="props">
            <slot :name="slot" v-bind="{ ...props, data: data.data }"/>
          </template>

          <template #action>
            <div class="row full-width q-mt-lg justify-end">
              <QSeparator class="full-width q-mb-md" size="1px"/>

              <div
                v-if="!readonly"
                class="col-xs-12 col-sm-2 col-md-2 text-left q-pl-xs"
              >
                <QBtn
                  unelevated
                  :loading="data.createOrEditIsLoading"
                  color="positive"
                  class="full-width q-ma-xs"
                  :label="$mt('app', 'Save')"
                  :disable="data.createOrEditIsLoading"
                  type="submit"
                />
              </div>
            </div>
          </template>
        </FormBuilder>
      </QCardSection>
    </QCard>
  </div>
</template>
