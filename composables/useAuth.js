import { computed, onBeforeMount } from "vue";
import { LocalStorage } from "quasar";
import { useAppStore } from "src/modules/app/stores/appStore";
import { userServices } from "src/modules/app/services/user.services";
// todo: use only core store
export const useAuth = () => {
  const appStore = useAppStore();

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
  const fetchProfile = () => {
    return new Promise((resolve, reject) => {
      userServices
        .getProfile()
        .then(({ data }) => {
          if (data?.data) {
            setUser(data?.data?.user);
            resolve(data?.data?.user);
          }
        })
        .catch((err) => reject(err));
    });
  };
  return {
    getToken,
    isLogin,
    getUser,
    setToken,
    logout,
    setUser,
    fetchProfile,
  };
};
