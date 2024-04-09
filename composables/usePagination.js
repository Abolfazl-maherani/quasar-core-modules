import { ref } from "vue";

export const usePagination = () => {
  const pagination = ref({
    sortBy: "id",
    descending: true,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: null,
  });
  return {
    pagination,
  };
};
