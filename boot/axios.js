import { boot } from "quasar/wrappers";
import axios from "axios";
import { useCoreStore } from "../stores/coreStore";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const axiosInstance = axios.create();

export default boot(({ app, store, ssrContext }) => {
  const coreStore = useCoreStore(store);

  if (ssrContext) {
    coreStore.setApiURL(
      ssrContext.req.headers?.["api-host"] || process.env.API_URL
    );
  } else {
    axiosInstance.interceptors.request.use((request) => {
      request.headers = coreStore.getAxiosRequestHeaders;

      return request;
    });
  }
  console.log(process.env);
  console.log(coreStore.apiURL);
  axiosInstance.defaults.baseURL = coreStore.apiURL;

  // for use inside Vue files (Options API) through this.$axios and this.$api
  app.config.globalProperties.$axios = axiosInstance;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
  // app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
  app.provide("axios", axiosInstance);
  // app.provide('api', api)
});

export { axiosInstance };
