import { computed } from "vue";
import _ from "lodash";
import { useI18n } from "vue-i18n";
export const useCore = () => {
  const { locale } = useI18n();
  const getLogo = computed(() => "/img/logo.png");
  const getLogoWithName = computed(() => "/img/logo-with-name.png");
  const getDarkLogo = computed(() => "/img/logo-dark.png");
  const getCurrentLocale = computed(() => locale.value);
  const findByAttribute = (fields, attribute) => {
    return _.find(fields, { attribute: attribute });
  };

  const findByValue = (fields, value) => {
    return _.find(fields, { value: value });
  };
  const findById = (fields, id) => {
    return _.find(fields, { id: id });
  };

  return {
    getLogo,
    getDarkLogo,
    getLogoWithName,
    getCurrentLocale,
    findByValue,
    findByAttribute,
    findById,
  };
};
