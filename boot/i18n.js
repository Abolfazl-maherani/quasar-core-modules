import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import messages from "src/modules/app/i18n";
import { indexOf } from "lodash/array";

function replaceDotInObjectKeys(obj) {
  let result = {};
  for (let key in obj) {
    let value = obj[key];
    let newKey = key.replace(/\./g, "**dot**");
    if (typeof value === "object" && value !== null) {
      value = replaceDotInObjectKeys(value);
    }
    result[newKey] = value;
  }
  return result;
}

// Change format keys for example add **dot** to key  that has `.`
const parsedMessages = replaceDotInObjectKeys(messages);

const i18n = createI18n({
  legacy: false,

  locale: "fa-IR",
  fallbackLocale: "en-US",
  formatFallbackMessages: true,
  strictMessage: true,
  fallbackRoot: true,
  missingWarn: true,
  fallbackWarn: false,
  messages: parsedMessages,
  missing: (locale, key, instance, type) => {
    const splitDot = key.split(".");

    if (splitDot?.length) return splitDot[splitDot.length - 1];
    return key.replace(/^([^.]+\.)/, "").replace("**dot**", ".");
  },
});

const mt = (moduleName, key, ...arg) => {
  // console.log(arg);

  return i18n.global.t(
    `${moduleName}.${key
      .replaceAll(".", "**dot**")
      .replaceAll("**nest**", ".")}`,
    ...arg
  );

  // if (
  //   Object.prototype.hasOwnProperty.call(
  //     i18n.global.messages.value[i18n.global.locale.value] || {},
  //     moduleName
  //   ) &&
  //   Object.prototype.hasOwnProperty.call(
  //     i18n.global.messages.value[i18n.global.locale.value][moduleName] || {},
  //     parsedKey
  //   ) &&
  //   i18n.global.messages.value[i18n.global.locale.value][moduleName][
  //     parsedKey
  //   ] !== null
  // ) {
  //   return i18n.global.t(`${moduleName}.${parsedKey}`, ...arg);
  // } else return i18n.global.rt(key, ...arg);
};

export default boot(async ({ app, ssrContext }) => {
  app.use(i18n);

  app.config.globalProperties.$mt = mt;
});

export { i18n, mt };
