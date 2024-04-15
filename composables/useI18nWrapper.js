import { useI18n } from "vue-i18n";
import { inject } from "vue";
import { i18n, mt } from "./../boot/i18n";
export const useI18nWrapper = () => {
  // const mt = inject("mt");
  // const i18n = useI18n();
  return {
    mt,
    ...i18n.global,
  };
};
