import { computed, inject, ref } from "vue";
import { useUserCoreStore } from "src/modules/core/stores/userCoreStore";

export const createPermissionName = (moduleName, role, subject, action) =>
  String.prototype.concat(moduleName, "/", role, "/", subject, "/", action);

export const usePermission = (moduleName, role, subject = null) => {
  const userCore = useUserCoreStore();

  const getPermissions = computed(() => userCore.getPermissions || []);
  const can = (action, subject) =>
    getPermissions.value.includes?.(
      createPermissionName(moduleName, role, subject, action)
    );

  return {
    can,
    getPermissions,
  };
};
