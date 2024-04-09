<script setup>
import { computed, reactive, ref, watch } from "vue";

import { isString } from "lodash";
import { useI18n } from "vue-i18n";
import { usePagination } from "src/modules/core/composables/usePagination";
import { useQuasar } from "quasar";

// import SkeletonTable from "components/skeleton/SkeletonTable.vue";

// import SkeletonFilter from "components/skeleton/SkeletonFilter.vue";
const { findById, findByAttribute, findByValue } = useCore();

import { useLoadingState } from "src/modules/core/composables/useLoadingState";
import { useNotify } from "src/modules/core/composables/useNotify";
import DeleteDialog from "src/modules/core/@crud/dialogs/deleteDialog.vue";
import SelectDialog from "src/modules/core/@crud/dialogs/SelectDialog.vue";
import { generateInputTypeFromFields } from "src/modules/core/utils/modules";
import { useMoment } from "src/modules/core/composables/useMoment";
import CrudDataListCardMobile from "src/modules/core/@crud/CrudDataListCardMobile.vue";
import FormBuilder from "src/modules/core/@crud/FormBuilder.vue";
import { useCore } from "src/modules/core/composables/useCore";
import { useCrud } from "src/modules/core/composables/useCrud";
import { useI18nWrapper } from "src/modules/core/composables/useI18nWrapper";
import SkeletonFilter from "src/modules/core/@crud/Skeleton/SkeletonFilter.vue";
import SkeletonTable from "src/modules/core/@crud/Skeleton/SkeletonTable.vue";
import {
  createPermissionName,
  usePermission,
} from "src/modules/core/composables/usePermission";

const props = defineProps({
  withDomainFilter: Boolean,
  columns: {
    type: Array,
    required: true,
  },
  hideFilterBox: Boolean,
  role: {
    type: String,
    default: "admin", // admin, user, site, etc.
  },
  viewRouteName: {
    type: String,
    default: "",
  },
  subject: {
    type: String,
    required: true,
  },
  moduleName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  rowKey: {
    type: [Function, String],
    default: "id",
  },
  noLikeFilter: {
    type: Array,
    default: () => [],
  },
  withOutAction: {
    type: Boolean,
    default: false,
  },
});

const { pagination } = usePagination();
const filterLoading = useLoadingState();
const loading = useLoadingState(false);
const batchLoading = useLoadingState();
const generateEndpoint = computed(() => {
  return String.prototype.concat(
    props.moduleName,
    "/",
    props.role,
    "/",
    props.subject
  );
});
const crud = useCrud(generateEndpoint.value);
const { mt } = useI18nWrapper();
const { getPermissions, can } = usePermission(
  props.moduleName,
  props.role,
  props.subject
);
const $q = useQuasar();
const { t, locale } = useI18n();

const selected = ref([]);

const { moment } = useMoment();
const data = reactive({
  filter: {},
  selectedDialog: false,
  defaultNoLike: [
    "id",
    "status",
    "created_at",
    "updated_at",
    "started_date",
    "ended_date",
  ],
  filters: {},
  expendFilterBox: false,
  withSelected: {},
  fields: [],
  filterFields: [],
  data: [],
  selected: [],

  deleteObjDialog: {
    show: false,
    id: null,
  },
});
const { fireNegativeWithAction, firePositive } = useNotify();
const fetchFields = () => {
  loading.enableLoading();
  crud
    .fields()
    .then((res) => {
      if (res.data) {
        data.fields = res.data;
        fetchData();
      }
    })
    .finally(() => {});
};

const fetchData = (params = {}) => {
  if (!Object.keys(params).includes("pagination")) {
    const { page, rowsPerPage, sortBy, descending } = pagination.value;
    const perPage = rowsPerPage === 0 ? pagination.value : rowsPerPage;
    Object.assign(params, {
      "per-page": perPage,
      page,
      sort: (descending ? "-" : "") + sortBy,
    });
  } else {
    const { page, rowsPerPage, sortBy, descending } = params.pagination;
    const perPage =
      rowsPerPage === 0 ? pagination.value.rowsNumber : rowsPerPage;

    Object.assign(params, {
      "per-page": perPage,
      page,
      sort: (descending ? "-" : "") + sortBy,
    });
    delete params.pagination;
  }
  if (!loading.isLoading.value) loading.enableLoading();
  if (params?.filter) {
    let obj = {};
    const { filter } = params;
    const noLike = [...(props.noLikeFilter || []), ...data.defaultNoLike];

    if (filter) {
      if (props.withDomainFilter) {
        if (
          Object.keys(filter).includes("started_date") ||
          Object.keys(filter).includes("ended_date")
        ) {
          const startedDate = filter?.started_date;
          const endedDate = filter?.ended_date;
          const checkBothDomain = startedDate && endedDate;
          const checkStartDateOnly = !!startedDate;
          const checkEndDateOnly = !!endedDate;

          if (checkBothDomain) {
            Object.assign(obj, {
              "created_at][>=": moment
                .value(startedDate)
                .format(app.formatForSend),
              "created_at][<": moment
                .value(endedDate)
                .add(1, "days")
                .format(app.formatForSend),
            });
          } else if (checkStartDateOnly) {
            Object.assign(obj, {
              "created_at][>=": moment
                .value(startedDate)
                .format(app.formatForSend),
            });
          } else if (checkEndDateOnly) {
            Object.assign(obj, {
              "created_at][<": moment
                .value(endedDate)
                .add(1, "days")
                .format(app.formatForSend),
            });
          }
        }
      }
      for (const filterKey in filter) {
        if (!noLike.includes(filterKey)) {
          Object.assign(obj, {
            [filterKey]: {
              like: filter[filterKey],
            },
          });
        } else if (filter[filterKey] || filter[filterKey] === 0) {
          if (!["started_date", "ended_date"].includes(filterKey)) {
            Object.assign(obj, {
              [filterKey]: filter[filterKey],
            });
          }
        }
      }
      Object.assign(params, {
        filter: obj,
      });
    }
  }
  crud
    .getAll({
      params,
    })
    .then((res) => {
      if (res.data) {
        pagination.value.rowsNumber = res.headers["x-pagination-total-count"];
        pagination.value.page = params.page;
        pagination.value.rowsPerPage = params["per-page"];
        pagination.value.sortBy = params.sort;
        pagination.value.descending = params.descending;
        data.data = res.data;
      }
    })
    .finally(() => {
      loading.disableLoading();
    });
};

const fetchFilterFields = () => {
  filterLoading.enableLoading();
  crud
    .fields("filter")
    .then((res) => {
      if (res.data) {
        data.filterFields = res.data;
      }
    })
    .finally(() => {
      filterLoading.disableLoading();
    });
};
const deleteItem = () => {
  fireNegativeWithAction(
    mt("core", "Are you sure to delete this item?"),
    () => {
      crud.delete(data.deleteObjDialog.id).then(() => {
        firePositive(mt("core", "The item deleted successfully."));
        fetchData();
      });
    },
    null,
    {
      position: "center",
      icon: "warning",
    }
  );
};
const batchAction = (action) => {
  if (batchLoading.isLoading.value) return;
  const ids = data.selected.map((item) => item.id);
  batchLoading.enableLoading();
  crud
    .batch(action, ids, data.withSelected)
    .then((res) => {
      data.selected = [];
      data.selectedDialog = false;
      $q.notify({
        type: "positive",
        position: "bottom",
        message: res.data.message,
      });

      fetchData();
    })
    .catch((error) => {
      if (error.response) {
        $q.notify({
          type: "negative",
          position: "bottom",
          message: error.response.data.message,
        });
      }
    })
    .finally(() => {
      batchLoading.disableLoading();
    });
};

const generateSlotFilterName = (slotName) => {
  return slotName.replace("filter-", "");
};

const generateColumns = computed(() => {
  if (!data.fields.length) return [];
  let columns = props.columns;
  if (!props.withOutAction && !columns.includes("actions"))
    columns.push("actions");
  return columns.map((item) => {
    if (isString(item)) {
      return {
        name: item,
        field: item,
        label:
          findByAttribute(data.fields, item)?.label ||
          mt("core", item.charAt(0).toUpperCase() + item.slice(1)),
        sortable: item === "id",
        align: "center",
      };
    }
  });
});

const generateViewRouteName = computed(() => {
  if (props.viewRouteName) return props.viewRouteName;
  return createPermissionName(
    props.moduleName,
    props.role,
    props.subject,
    "view"
  );
});
const generateCreateRouteName = computed(() => {
  return createPermissionName(
    props.moduleName,
    props.role,
    props.subject,
    "create"
  );
});
const generateFilterFields = computed(() => {
  if (!data.filterFields?.length) return [];

  const resultFields = [
    data.filterFields
      .filter(
        (item) =>
          !["created_at", "updated_at"].includes(item.attribute) && item.safe
      )
      .map((item) => {
        if (item.safe) {
          return {
            ...item,
            attr: {
              clearable: generateInputTypeFromFields(item, true) === "datetime",
            },
            name: item.attribute,
            type: generateInputTypeFromFields(item, true),
            // rules: this.findByAttribute(this.fields, item.name)?.rules || item.rules,
            field: item,
          };
        }
      }),
  ];
  if (props.withDomainFilter) {
    resultFields.unshift([
      {
        name: "started_date",
        type: "datetime",
        label: mt("core", "Date created from"),
        // rules: this.findByAttribute(this.fields, item.name)?.rules || item.rules,
        field: {},
      },
      {
        name: "ended_date",
        type: "datetime",
        label: mt("core", "Date created to"),
        // rules: this.findByAttribute(this.fields, item.name)?.rules || item.rules,
        field: {},
      },
    ]);
  }
  return resultFields;
});

const metaCrud = computed(() => ({
  viewLink: generateViewRouteName.value,
  moduleName: props.moduleName,
  subject: props.subject,
  role: props.role,
  columns: generateColumns,
}));

fetchFields();
fetchFilterFields();
watch(
  locale,
  () => {
    fetchFields();
    fetchFilterFields();
  },
  {
    immediate: false,
  }
);
import { colors } from "quasar";
const { getPaletteColor } = colors;
</script>
<template>
  <div>
    <!-- 👉️ Filter -->
    <QCard bordered flat>
      <QCardSection class="no-padding">
        <QExpansionItem
          v-model="data.expendFilterBox"
          expand-separator
          icon="filter_alt"
          :label="$mt('core', 'Search')"
          header-class="text-bold bg-primary-variant text-primary"
          class="accordion"
          expand-icon-class="text-primary"
          style="border-radius: inherit; overflow: hidden"
        >
          <QCardSection v-if="!filterLoading.isLoading.value">
            <FormBuilder
              inline-action
              @submit="
                fetchData({
                  filter: data.filters,
                })
              "
              v-if="generateFilterFields.length"
              v-model="data.filters"
              :form-structure="generateFilterFields"
              class="full-width q-pt-md q-pb-none"
              :responsive-col-class="['col-12 q-mb-md', 'col-12']"
            >
              <template
                v-for="slot in Object.keys($slots)"
                #[generateSlotFilterName(slot)]="slotProps"
              >
                <slot
                  v-bind="{
                    props: slotProps,
                    fields: data.filterFields,
                    data: data.filters,
                  }"
                  :name="slot"
                />
              </template>

              <template #action="{ responsiveItemClass }">
                <div :class="responsiveItemClass">
                  <QBtn
                    unelevated
                    color="secondary"
                    :label="$mt('core', 'Filter')"
                    type="submit"
                    class="q-py-sm q-mt-lg"
                    style="min-width: 110px"
                  />
                </div>
              </template>
            </FormBuilder>
          </QCardSection>
          <QCardSection v-else>
            <SkeletonFilter />
          </QCardSection>
        </QExpansionItem>
      </QCardSection>
    </QCard>

    <!-- 👉️ Datalist -->
    <QCard bordered flat class="q-mt-sm">
      <QCardSection class="card-header items-center row">
        <div class="text-bold col-">
          <!-- <div class="text-bold">{{ p.label }}</div> -->
          <div class="row selected-btns">
            <div v-if="can('batch', subject)" class="q-mr-sm">
              <QBtn
                class="full-width q-ma-xs"
                :label="`${mt('app', 'With selected')} (${
                  data.selected.length
                } ${mt('app', 'items')})`"
                :disable="data.selected.length === 0"
                @click="data.selectedDialog = true"
              />
            </div>
          </div>
        </div>
        <div class="q-space" />
        <div class="col- flex q-gutter-sm">
          <slot name="headingAction" />

          <QBtn
            :to="{ name: generateCreateRouteName }"
            color="positive"
            :label="$mt('core', 'create')"
            size="md"
            icon="add"
            v-if="can('create', subject)"
          />
        </div>
      </QCardSection>
      <QSeparator inset />

      <QCardSection v-if="loading.isLoading.value" class="card-body no-padding">
        <SkeletonTable />
      </QCardSection>

      <QCardSection v-else class="card-body no-padding">
        <!-- DataList -->
        <QTable
          table-class="text-body"
          v-bind="$attrs"
          ref="gridview"
          :dense="$q.screen.lt.md"
          class="q-pa-sm shadow-0"
          table-header-class="custom-table-header text-secondary"
          :rows="data.data"
          :columns="generateColumns"
          :row-key="'title'"
          v-model:pagination="pagination"
          @request="fetchData"
          :filter="data.filter"
          binary-state-sort
          :hide-header="data.length === 0"
          selection="multiple"
          v-model:selected="data.selected"
          hide-selected-banner
        >
          <template v-for="slot in Object.keys($slots)" #[slot]="slotProps">
            <slot
              :name="slot"
              v-bind="{
                props: slotProps,
                fields: data.fields,
                data: data,
                metaCrud,
              }"
            />
          </template>

          <!--    Customization cells      -->
          <template v-if="columns.includes('id')" #body-cell-id="props">
            <QTd :props="props">
              <router-link
                class="text-primary"
                :to="{
                  name: generateViewRouteName,
                  params: { id: props.row['id'] },
                }"
              >
                <span>#</span>
                <span>{{ props.row["id"] }}</span>
              </router-link>
            </QTd>
          </template>
          <template
            v-if="columns.includes('created_at')"
            #body-cell-created_at="props"
          >
            <QTd :props="props">
              <!--      TODO: Change manuly date time format to dynamicly        -->
              <!--      {{ moment(props.row.created_at).format(app.getDateTimeFormat) }} -->
              {{ moment(props.row.created_at).format("YYYY-MM-DD") }}
            </QTd>
          </template>
          <template
            v-if="columns.includes('status')"
            #body-cell-status="{ props, data }"
          >
            <QTd :props="props">
              <QBadge
                class="q-pa-sm text-primary-variant text-center"
                color="primary-variant"
              >
                {{
                  findByValue(
                    findByAttribute(data.fields, "status").options,
                    props.row.status
                  ).label
                }}
              </QBadge>
            </QTd>
          </template>
          <template v-if="columns.includes('avatar')" #body-cell-avatar="props">
            <QTd :props="props">
              <QAvatar
                text-color="primary-variant"
                color="primary-variant"
                size="xlg"
                font-size=".9rem"
                rounded
              >
                <QImg
                  width="100%"
                  height="100%"
                  loading="eager"
                  fit="cover"
                  :src="props.row.avatar"
                >
                  <template #error>
                    <span
                      class="text-bold flex justify-center items-center full-width full-height"
                    >
                      <span v-if="props?.row?.firstname || props?.row?.title">
                        {{
                          props?.row?.firstname?.[0] || props?.row?.title?.[0]
                        }}
                      </span>
                      <span v-if="props?.row?.lastname">
                        {{ props?.row?.lastname?.[0] }}</span
                      >

                      <span v-else> ? </span>
                    </span>
                  </template>
                  <template #loading>
                    <QSpinner size="sm" color="primary"></QSpinner>
                  </template>
                </QImg>
              </QAvatar>
            </QTd>
          </template>
          <template
            v-if="columns.includes('actions')"
            #body-cell-actions="props"
          >
            <QTd :props="props">
              <QBtn
                v-if="can('update', subject)"
                flat
                color="primary"
                icon="edit"
                :to="{
                  name: generateViewRouteName,
                  params: { id: props.row.id },
                }"
                size="sm"
              />
              <QBtn
                v-if="can('delete', subject)"
                flat
                color="negative"
                icon="delete"
                @click="
                  data.deleteObjDialog.show = true;
                  data.deleteObjDialog.id = props.row.id;
                "
                size="sm"
              />
            </QTd>
          </template>
          <template v-if="$q.screen.xs" #header="propsSlot">
            <div class="flex justify-between">
              <QCheckbox
                v-model="propsSlot.selected"
                :label="$mt('core', 'select All')"
              />
            </div>
          </template>
          <template #item="propsSlot">
            <CrudDataListCardMobile
              v-slot="props"
              :view-route-name="generateViewRouteName"
              v-model="propsSlot.selected"
              @update:delete-dialog="data.deleteObjDialog = $event"
            >
              <slot
                name="mobile-card"
                v-bind="{ props, fields: data.fields, data, metaCrud }"
              />
            </CrudDataListCardMobile>
          </template>
        </QTable>
      </QCardSection>
    </QCard>
    <SelectDialog
      @delete="batchAction('delete')"
      @apply="batchAction('apply')"
      :is-loading="batchLoading.isLoading.value"
      v-model="data.selectedDialog"
      v-model:selected="data.selected"
    >
      <template #batch-body="slotProps">
        <slot
          name="batch-body"
          v-bind="{
            ...slotProps,
            withSelected: data.withSelected,
            fields: data.fields,
            data: data.data,
          }"
        />
      </template>
    </SelectDialog>
    <DeleteDialog :callback="deleteItem" v-model="data.deleteObjDialog.show" />
  </div>
</template>
<style scoped lang="scss">
:deep(.accordion) {
  .q-item__section--side > .q-expansion-item__toggle-icon {
    font-size: 1.1rem;
  }
}
a {
  text-decoration: none;
}
:deep(.q-table tbody td) {
  font-weight: 400;
}
.accordion :deep(.q-item__section) {
  min-width: auto;
  padding: 0;
}
</style>
