import { ref } from "vue";

export const useLoadingState = (initial = false) => {
  const isLoading = ref(initial);
  const enableLoading = () => {
    isLoading.value = true;
  };
  const disableLoading = () => {
    isLoading.value = false;
  };
  return {
    isLoading,
    enableLoading,
    disableLoading,
  };
};
