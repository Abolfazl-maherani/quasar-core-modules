import { computed } from "vue";
import { useLocalStorage } from "@vueuse/core";

export const useAuth = () => {
  const accessToken = useLocalStorage("access-token", null);
  accessToken.value = "mam";
  const getUser = {};
  const getToken = computed(() => accessToken.value);
  const isLogin = computed(() => !!getToken.value);
  const login = () => {};
  const signin = () => {};
  const setToken = () => {};

  return {
    getToken,
    isLogin,
  };
};
