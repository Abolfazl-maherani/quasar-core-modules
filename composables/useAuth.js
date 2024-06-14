import { computed, onBeforeMount } from "vue";
import { LocalStorage } from "quasar";
import { useAppStore } from "src/modules/app/stores/appStore";

export const useAuth = () => {
  const appStore = useAppStore();
  onBeforeMount(() => {
    appStore.setUser(LocalStorage.getItem("user-data"));
    appStore.setToken(LocalStorage.getItem("access-token"));
  });

  const getUser = computed(() => appStore.getUser);
  const getToken = computed(() => appStore.getToken);
  const isLogin = computed(() => !!(getToken.value && getUser.value));
  const setUser = (userValue) => {
    try {
      LocalStorage.set("user-data", userValue);
      appStore.setUser(userValue);
    } catch (err) {
      console.log(err);
    }
  };

  const setToken = (tokenValue) => {
    try {
      LocalStorage.set("access-token", tokenValue);
      appStore.setToken(tokenValue);
    } catch (err) {
      console.log(err);
    }
  };
  const logout = () => {
    LocalStorage.remove("access-token");
    LocalStorage.remove("user-data");
    appStore.setUser(null);
    appStore.setToken(null);
  };
  return {
    getToken,
    isLogin,
    getUser,
    setToken,
    logout,
    setUser,
  };
};
