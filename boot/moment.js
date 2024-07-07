import { boot } from "quasar/wrappers";
import moment from "moment-jalaali";

export default boot(({ app, ssrContext }) => {
  if (!ssrContext) {
    app.config.globalProperties.$moment = moment;
  }
});
