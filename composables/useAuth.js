import { computed, onBeforeMount } from "vue";
import { LocalStorage } from "quasar";

import { userServices } from "src/modules/app/services/user.services";
import { useCoreStore } from "src/modules/core/stores/coreStore";
// todo: use only core store
export const useAuth = () => {
  const coreStore = useCoreStore();

  const getUser = computed(() => coreStore.getUser);
  const getToken = computed(() => coreStore.getToken);
  const isLogin = computed(() => !!(getToken.value && getUser.value));
  const setUser = (userValue) => {
    try {
      LocalStorage.set("user-data", userValue);
      coreStore.setUser(userValue);
    } catch (err) {
      console.log(err);
    }
  };

  const setToken = (tokenValue) => {
    try {
      LocalStorage.set("access-token", tokenValue);
      coreStore.setToken(tokenValue);
    } catch (err) {
      console.log(err);
    }
  };
  const logout = () => {
    LocalStorage.remove("access-token");
    LocalStorage.remove("user-data");
    coreStore.setUser(null);
    coreStore.setToken(null);
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
