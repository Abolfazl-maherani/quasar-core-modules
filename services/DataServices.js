import { axiosInstance } from "src/modules/core/boot/axios";
import { concatURL } from "src/modules/core/utils/basic";

const base = "/app/site/data";
// 👉 language
const getLanguage = () => axiosInstance.get(concatURL(base, "language"));

// 👉 config
// axiosRequestConfig passed from ssr to set correct language header
const getConfig = (axiosRequestConfig = null) => {
  return axiosInstance.get(concatURL(base, "config"), axiosRequestConfig);
};

// 👉 index
const getIndex = () => {
  return axiosInstance.get(concatURL(base, "index"));
};

export const dataServices = {
  getLanguage,
  getConfig,
  getIndex,
};
