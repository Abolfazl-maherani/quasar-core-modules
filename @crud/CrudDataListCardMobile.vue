<script setup>
import { useVModel } from "@vueuse/core";

const props = defineProps({
  selected: Object,
  params: Object,
  viewRouteName: String,
});
const emits = defineEmits(["update:selected"]);
const selected = useVModel(props, "selected", emits);
</script>
<template>
  <div class="q-py-xs col-xs-12 grid-style-transition">
    <QCard :class="params.selected ? 'bg-grey-2' : ''">
      <div class="absolute-left">
        <QCheckbox v-model="selected" />
      </div>

      <div class="absolute-right">
        <QBtn color="grey-7" round flat icon="more_vert">
          <QMenu auto-close>
            <QList separator>
              <QItem
                clickable
                :to="{ name: viewRouteName, params: { id: params.row['id'] } }"
              >
                <QItemSection side>
                  <QIcon name="visibility" />
                </QItemSection>
                <QItemSection>
                  <QItem-label>{{ $mt("app", "Details") }}</QItem-label>
                </QItemSection>
              </QItem>

              <QItem
                clickable
                @click="
                  $emit('update:deleteDialog', {
                    dialog: true,
                    id: params.row['id'],
                  })
                "
              >
                <QItemSection side class="text-negative">
                  <QIcon name="delete" />
                </QItemSection>
                <QItemSection class="text-negative">
                  <QItem-label>{{ $mt("app", "حذف") }}</QItem-label>
                </QItemSection>
              </QItem>
            </QList>
          </QMenu>
        </QBtn>
      </div>

      <router-link
        :to="{ name: viewRouteName, params: { id: params.row['id'] } }"
      >
        <div class="row q-mx-xl q-pt-xs">
          <div class="col-xs-4 q-px-sm q-py-xs text-left">
            #{{ params.row["id"] }}
          </div>

          <div class="col-xs-8 q-px-sm q-py-xs text-right text-bold">
            &lrm;{{
              $moment(params.row["created_at"]).format(
                config.calendar.formats.shortDateTime
              )
            }}
          </div>
          <slot v-bind="props" />
        </div>
      </router-link>
    </QCard>
  </div>
</template>
