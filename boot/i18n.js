import { boot } from "quasar/wrappers";
import { createI18n } from "vue-i18n";
import messages from "src/modules/app/i18n";

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

const parsedMessages = replaceDotInObjectKeys(messages);

const i18n = createI18n({
  legacy: false,
  locale: "fa-IR",
  fallbackLocale: "en-US",
  formatFallbackMessages: true,
  strictMessage: false,

  missingWarn: false,
  fallbackWarn: false,
  messages: parsedMessages,
  missing: (locale, key, instance, type) => {
    return key.replace(/^([^.]+\.)/, "").replace("**dot**", ".");
  },
});

const mt = (moduleName, key, ...arg) => {
  // console.log(arg);
  return i18n.global.t(`${moduleName}.${key.replace(".", "**dot**")}`, ...arg);

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
