import { countSlashes } from "src/modules/core/utils/basic";
// import { useCoreStore } from "src/modules/core/stores/coreStore";
// import { i18n } from "src/modules/core/boot/i18n";

export const validateRouteByLang = (
  redirect,
  currentRoute,
  defaultLang,
  languages
) => {
  // const coreStore = useCoreStore();
  const currentLangInRoute = currentRoute.params.lang;
  const { fullPath } = currentRoute;
  let setedLang = currentLangInRoute;
  const arrOfAvailableLang = languages?.map((item) => item.value);

  if (!currentLangInRoute || !arrOfAvailableLang.includes(currentLangInRoute)) {
    setedLang = defaultLang;

    if (countSlashes(fullPath) === 1 || !currentLangInRoute)
      redirect({
        name: "lang",
        params: {
          lang: setedLang,
        },
      });
    else
      redirect(
        `/${setedLang}${fullPath.substring(currentLangInRoute.length + 1)}`
      );
  }
  return languages.find((item) => item.value === setedLang);
};
export const arrayRange = (start, stop, step) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );
