import { Guard } from "@/models/guard.model";
import { authService } from "@@/src";

export const loginPageGuard: Guard = async () => {
  const isAuthenticated = authService.isAuthenticated();

  return isAuthenticated ? "main" : true;
};
