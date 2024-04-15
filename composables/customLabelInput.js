import { computed, ref } from "vue";

export const useCustomLabelInput = () => {
  const inputRef = ref(null);
  const focusInput = () => {
    inputRef.value.focus();
  };
  const generateUuid = computed(
    () => "input-" + Math.random().toString(36).substring(2, 9)
  ); // Generate a unique ID
  return {
    focusInput,
    inputRef,
    generateUuid,
  };
};
