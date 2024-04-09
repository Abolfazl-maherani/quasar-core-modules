import { defineStore } from "pinia";

export const useUserCoreStore = defineStore("userCore", {
  state: () => ({
    user: null,
  }),
  getters: {
    getUser() {
      return this.user;
    },
    getPermissions() {
      return this.user?.permissions || [];
    },
    // getCurrentLocale() {
    //   return this.currentLang?.locale;
    // },
  },
  actions: {
    setUser(value) {
      this.user = value;
    },
  },
});
