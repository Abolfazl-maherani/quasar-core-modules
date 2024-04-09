import { defineStore } from "pinia";

export const useCrudStore = defineStore("crud", {
  state: () => ({
    selectBoxInputComponent: null,
    textInputComponent: null,
    textareaInputComponent: null,
    dateTimeInputComponent: null,
  }),
  actions: {
    setSelectBoxInputComponent(component) {
      this.selectBoxInputComponent = component;
    },
    setTextInputComponent(component) {
      this.textInputComponent = component;
    },
    setTextareaInputComponent(component) {
      this.TextareaInputComponent = component;
    },
    setDateTimeInputComponent(component) {
      this.dateTimeInputComponent = component;
    },
  },
});
