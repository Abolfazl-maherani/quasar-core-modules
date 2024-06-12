import { computed } from "vue";
import { useLocalStorage } from "@vueuse/core";
import { LocalStorage } from "quasar";

export const useAuth = () => {
  const getUser = computed(() => LocalStorage.getItem("user-data"));
  const getToken = computed(() => LocalStorage.getItem("access-token"));
  const isLogin = computed(() => !!getToken.value);
  const setUser = (user) => {
    LocalStorage.set("user-data", user);
  };
  const setToken = (token) => {
    LocalStorage.set("access-token", token);
  };
  return {
    getToken,
    isLogin,
    getUser,
    setToken,
    setUser,
  };
};
