import { defineStore } from "pinia";
import { LocalStorage, useMeta } from "quasar";
import { useRoute } from "vue-router";
import { i18n } from "src/modules/core/boot/i18n";
import { toRaw } from "vue";
import { Quasar } from "quasar";
export const useCoreStore = defineStore("core", {
  state: () => ({
    apiURL: null,
    config: null,
    language: null,
    token: null,
    // user: null,
    meta: null,
    darkMode: null,
    themeConfig: null,
  }),
  getters: {
    getUser() {
      return this.user || LocalStorage.getItem("user-data") || null;
    },
    getToken() {
      return this.token || LocalStorage.getItem("access-token") || null;
    },
    getAxiosRequestHeaders() {
      let headers = {
        "Accept-Language": this.language?.locale || Quasar.lang.isoName,
      };
      if (this.getToken) {
        headers["Authorization"] = "Bearer " + this.getToken;
      }
      return headers;
    },
    getMeta() {
      const route = useRoute();

      return {
        // sets document title
        title: route?.meta?.title() || this.meta?.title,
        // title: this.meta?.title,
        // optional; sets final title as "Index Page - My Website", useful for multiple level meta
        titleTemplate: (title) => `${this.config?.title} - ${title}`,

        // meta tags
        meta: {
          description: {
            name: "description",
            content: this.config?.description,
          },
          keywords: { name: "keywords", content: this.config?.keywords },
          equiv: {
            "http-equiv": "Content-Type",
            content: "text/html; charset=UTF-8",
          },
          // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
          // ogTitle: {
          //   property: "og:title",
          //   // optional; similar to titleTemplate, but allows templating with other meta properties
          //   template(ogTitle) {
          //     return `${ogTitle} - ${this.config?.title}`;
          //   },
          // },
        },

        // CSS tags
        // link: {
        //   material: {
        //     rel: "stylesheet",
        //     href: "https://fonts.googleapis.com/icon?family=Material+Icons",
        //   },
        // },

        // // JS tags
        // script: {
        //   ldJson: {
        //     type: "application/ld+json",
        //     innerHTML: `{ "@context": "http://schema.org" }`,
        //   },
        // },

        // // <html> attributes
        // htmlAttr: {
        //   "xmlns:cc": "http://creativecommons.org/ns#", // generates <html xmlns:cc="http://creativecommons.org/ns#">,
        //   empty: undefined, // generates <html empty>
        // },

        // // <body> attributes
        // bodyAttr: {
        //   "action-scope": "xyz", // generates <body action-scope="xyz">
        //   empty: undefined, // generates <body empty>
        // },

        // <noscript> tags
        noscript: {
          default: "This is content for browsers with no JS (or disabled JS)",
        },
      };
    },
    getTitle() {
      return this.getMeta?.title;
    },
    getDarkMode() {
      return this.darkMode ?? LocalStorage.getItem("app.darkMode") ?? "auto";
    },
    getThemeConfig() {
      return this.themeConfig || LocalStorage.getItem("themeConfig");
    },
  },
  actions: {
    setApiURL(value) {
      this.apiURL = value;
    },
    setConfig(payload) {
      let newConfig = JSON.parse(JSON.stringify(this.config));
      if (!newConfig) {
        newConfig = {};
      }

      const keys = Object.keys(payload);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        newConfig[key] = payload[key];
      }

      this.config = newConfig;
    },
    setLanguage(value) {
      this.language = value;
    },
    setUser(value) {
      this.user = value;
    },
    setToken(value) {
      this.token = value;
    },
    setMeta(payload) {
      let newMeta = JSON.parse(JSON.stringify(this.meta));
      if (!newMeta) {
        newMeta = {};
      }

      const keys = Object.keys(payload);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        newMeta[key] = payload[key];
      }

      this.meta = newMeta;

      useMeta(this.getMeta);
    },
    toggleDarkMode() {
      if (this.getDarkMode === "auto") {
        this.darkMode = true;
      } else if (this.getDarkMode === true) {
        this.darkMode = false;
      } else {
        this.darkMode = "auto";
      }

      LocalStorage.set("app.darkMode", this.darkMode);
    },
    setThemeConfig(key, value) {
      const themeConfig = this.getThemeConfig;
      this.themeConfig = Object.assign(
        {
          ...(themeConfig || {}),
        },
        {
          [key]: value,
        }
      );
      LocalStorage.set("themeConfig", this.themeConfig);
    },
  },
});
