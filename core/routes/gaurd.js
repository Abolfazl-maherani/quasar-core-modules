import { useAuth } from "src/modules/core/composables/useAuth";

export const checkLogin = (to, from) => {
  if (to.meta?.guest) return true;
  const { isLogin } = useAuth();

  return !!isLogin.value;
};
