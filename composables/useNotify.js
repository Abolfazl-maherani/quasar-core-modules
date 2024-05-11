import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

export const useNotify = () => {
  const $q = useQuasar();
  const { t } = useI18n();

  let dismiss = null;
  const fireNegative = (message, opt = {}) => {
    dismiss = $q.notify({
      type: "negative",
      position: "top",
      message: message,
      timeout: 0,

      ...opt,
    });
  };
  const fireNegativeWithAction = (message, successCb, cancelCb, opt = {}) => {
    fireNegative(message, {
      actions: [
        {
          label: "no",
          color: "white",
          handler: () => {
            cancelCb?.();
          },
        },
        {
          label: "yes",
          color: "yellow",
          handler: () => {
            successCb?.();
          },
        },
      ],
      ...opt,
    });
  };
  const firePositive = (message, opt = {}) => {
    dismiss = $q.notify({
      type: "positive",
      position: "top",
      message: message,
      timeout: 0,
      ...opt,
    });
  };
  const firePositiveWithAction = (message, successCb, cancelCb, opt = {}) => {
    firePositive(message, {
      actions: [
        {
          label: "no",
          color: "white",
          handler: () => {
            cancelCb?.();
          },
        },
        {
          label: "yes",
          color: "yellow",
          handler: () => {
            successCb?.();
          },
        },
      ],
      ...opt,
    });
  };
  return {
    fireNegative,
    firePositive,
    firePositiveWithAction,
    fireNegativeWithAction,
    dismiss,
  };
};
