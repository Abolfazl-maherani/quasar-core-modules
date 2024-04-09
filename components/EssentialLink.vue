<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },
  },
});
</script>

<template>
  <QItem clickable tag="a" target="_blank" :href="link">
    <QItemSection v-if="icon" avatar>
      <QIcon :name="icon" />
    </QItemSection>

    <QItemSection>
      <QItem-label>{{ title }}</QItem-label>
      <QItem-label caption>
        {{ caption }}
      </QItem-label>
    </QItemSection>
  </QItem>
</template>
