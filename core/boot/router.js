import { boot } from "quasar/wrappers";
import { useCoreStore } from "../stores/coreStore";
import { Quasar } from "quasar";
import { dataServices } from "../services/DataServices";
import { validateRouteByLang } from "../routes/utils";
import { i18n } from "./i18n";
import { useUserCoreStore } from "src/modules/core/stores/userCoreStore";

export default boot(async ({ router, store, redirect, ssrContext }) => {
  const coreStore = useCoreStore(store);

  const langList = import.meta.glob(
    "../../../../node_modules/quasar/lang/(en-US|fa-IR|ar).mjs"
  );

  router.beforeEach((to, from) => {
    return new Promise(async (resolve, reject) => {
      if (ssrContext) {
        try {
          const language = await dataServices.getLanguage();

          const languageObject = validateRouteByLang(
            redirect,
            to,
            language.data.language,
            language.data.languages
          );

          coreStore.setConfig(language.data);

          coreStore.setLanguage(languageObject);

          const config = await dataServices.getConfig({
            headers: coreStore.getAxiosRequestHeaders,
          });

          coreStore.setConfig(config.data);
        } catch (e) {}
      }

      if (to.params.lang !== from.params.lang) {
        if (coreStore.language?.locale) {
          try {
            langList[
              `../../../../node_modules/quasar/lang/${coreStore.language?.locale}.mjs`
            ]().then((lang) => {
              if (ssrContext) {
                const dir = lang.default.rtl === true ? "rtl" : "ltr";
                const attrs = `lang=${lang.default.isoName} dir=${dir}`;

                ssrContext._meta.htmlAttrs =
                  ssrContext.__qPrevLang !== void 0
                    ? ssrContext._meta.htmlAttrs.replace(
                        ssrContext.__qPrevLang,
                        attrs
                      )
                    : attrs;

                ssrContext.__qPrevLang = attrs;
              } else {
                const el = document.documentElement;
                el.setAttribute(
                  "dir",
                  lang.default.rtl === true ? "rtl" : "ltr"
                );
                el.setAttribute("lang", lang.default.isoName);
              }

              Quasar.lang.set(lang.default, ssrContext);
              i18n.global.locale.value = lang.default.isoName;
            });
          } catch (err) {
            reject();
          }
        }

        if (process.env.CLIENT) {
          const index = await dataServices.getIndex();
          coreStore.setToken(index.data?.token);

          const userStore = useUserCoreStore();
          userStore.setUser(index.data?.user);
          coreStore.setConfig(index.data.config);
        }
      }

      resolve();
    });
  });
  router.beforeEach((to) => {
    if (coreStore?.config?.languages) {
      validateRouteByLang(
        redirect,
        to,
        coreStore.language,
        coreStore.config?.languages
      );
    }
  });
});
