import { axiosInstance } from "src/modules/core/boot/axios";

const concatToEndPoint = (endPoint, ...concat) => {
  return String.prototype.concat(endPoint, ...concat.map((item) => `/${item}`));
};

export const useCrud = (endPoint) => {
  const get = (id, options = {}) =>
    axiosInstance.get(concatToEndPoint(endPoint, id), options);
  const getAll = (options = {}) => axiosInstance.get(endPoint, options);
  const remove = (id, options = {}) =>
    axiosInstance.post(concatToEndPoint(endPoint, id), options);
  const create = (options = {}) => axiosInstance.post(endPoint, options);
  const update = (id, options = {}) =>
    axiosInstance.put(concatToEndPoint(endPoint, id), options);
  const batch = (action, ids, apply) => {
    return axiosInstance.post(String.prototype.concat(endPoint, "/", "batch"), {
      action,
      ids,
      apply,
    });
  };

  const fields = (scenario = "create", id = null, options = {}) => {
    return axiosInstance.options(
      String.prototype.concat(endPoint, `${id ? "/" : ""}`, `${id || ""}`),
      {
        ...options,
        params: {
          scenario,
        },
      }
    );
  };
  return {
    get,
    getAll,
    remove,
    create,
    update,
    batch,
    fields,
  };
};
