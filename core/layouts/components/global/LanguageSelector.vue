<template>
  <QBtnDropdown
    content-class="items-end"
    dropdown-icon="fa-solid fa-chevron-down"
    class="items-end"
    stretch
    flat
  >
    <template #label>
      <QNoSsr>
        <country-flag
          class="flex"
          :country="
            lodash.find(coreStore.config.languages, {
              locale: coreStore.language.locale,
            }).country
          "
        />
      </QNoSsr>
    </template>

    <div class="profile-button modal-width column q-pa-none">
      <QList separator>
        <QItem
          v-for="(language, languageIndex) in coreStore.config.languages"
          :key="`language-${languageIndex}`"
          @click="setLanguage(language)"
          clickable
          :active="coreStore.language.locale === language.locale"
          active-class="bg-grey-4"
          class="items-center"
        >
          <QItemSection class="flex items-center" side>
            <QNoSsr>
              <country-flag :country="language.country" />
            </QNoSsr>
          </QItemSection>
          <QItemSection>{{ language.title }}</QItemSection>
        </QItem>
      </QList>
    </div>
  </QBtnDropdown>
</template>

<script setup>
import lodash from "lodash";
import CountryFlag from "vue-country-flag-next";
import { useCoreStore } from "src/modules/core/stores/coreStore";
import { useRoute, useRouter } from "vue-router";

const coreStore = useCoreStore();
const router = useRouter();

function setLanguage(language) {
  coreStore.setLanguage(language);

  router.replace({
    params: {
      lang: language.value,
    },
  });
}
</script>

<style lang="scss" scoped>
:deep(.q-btn-dropdown__arrow) {
  font-size: 1rem;
}
</style>
