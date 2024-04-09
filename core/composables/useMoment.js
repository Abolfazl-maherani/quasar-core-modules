import moment from "moment-jalaali";
// import momentTimezone from "moment-timezone";

import en from "moment/locale/en-nz";
import fa from "moment/locale/fa";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

export const useMoment = () => {
  // if (app.getTimezone) {
  //   momentTimezone.tz.setDefault("UTC");
  // }
  const momentLocale = { fa, en };
  const { locale } = useI18n();
  const generateMoment = computed(() => {
    moment.locale(locale.value);
    if (locale.value === "fa-IR") moment.loadPersian();

    return moment;
  });
  const getFormatByCurrentLocale = (sampleGregorianFormat) => {
    const formatMap = {
      YYYY: "jYYYY",
      YY: "jYY",
      YYY: "jYYY",
      M: "jM",
      MM: "jMM",
      D: "jD",
      DD: "jDD",
      DDD: "jDDD",
      DDDD: "jDDDD",
      ddd: "jddd",
      dd: "jdd",
      dddd: "jdddd",
      MMM: "jMMM",
      MMMM: "jMMMM",
      H: "jH",
      HH: "jHH",
      h: "jh",
      hh: "jhh",
      m: "jm",
      mm: "jmm",
      s: "js",
      ss: "jss",
      A: "jA",
      a: "ja",
      // Add any additional formats you need
    };

    let jalaliFormatString = sampleGregorianFormat;

    // Replace each moment format token with its Jalali equivalent
    Object.keys(formatMap).forEach((token) => {
      const jalaliToken = formatMap[token];
      jalaliFormatString = jalaliFormatString.replace(
        new RegExp(token, "g"),
        jalaliToken
      );
      // Also replace lowercase versions
      jalaliFormatString = jalaliFormatString.replace(
        new RegExp(token.toLowerCase(), "g"),
        jalaliToken.toLowerCase()
      );
    });

    return locale.value === "fa-IR"
      ? jalaliFormatString
      : sampleGregorianFormat;
  };
  return { moment: generateMoment, getFormatByCurrentLocale };
};
