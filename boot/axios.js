import { boot } from "quasar/wrappers";
import axios from "axios";
import { useCoreStore } from "../stores/coreStore";
import { Notify } from "quasar";
import { mt } from "src/modules/core/boot/i18n";
import { useAuth } from "src/modules/core/composables/useAuth";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const axiosInstance = axios.create();
const alert = (message) =>
  Notify.create({
    message,
    type: "negative",
    position: "top",
  });
export default boot(({ app, store, ssrContext }) => {
  const coreStore = useCoreStore(store);

  if (ssrContext) {
    coreStore.setApiURL(
      /*ssrContext.req.headers?.["api-host"] ||*/ process.env.API_URL
    );
  } else {
    axiosInstance.interceptors.request.use((request) => {
      request.headers = coreStore.getAxiosRequestHeaders;

      return request;
    });
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (process.env.CLIENT) {
          const { data = undefined, status } = error?.response || {};

          if (data && status) {
            const { message } = data;
            switch (status) {
              case 500: {
                alert(message || mt("app", "Internal server error"));
                break;
              }
              case 401: {
                const { logout } = useAuth();
                alert(message || mt("app", "You do not have access"));
                logout();
                break;
              }
              case 400: {
                if (data?.errors && Object.keys(data?.errors)?.length) {
                  const firstError = Object.entries(data.errors);
                  const messageFirstError = firstError?.[0]?.[1]?.msg;
                  alert(messageFirstError);
                  return;
                }
                alert(message || mt("app", "Your input is invalid"));
                break;
              }
              default: {
                if (message) alert(message);
                break;
              }
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  console.log(process.env.API_URL);
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
