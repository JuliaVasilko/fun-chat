import { Guard } from "@/models/guard.model";
import { authService } from "@@/src";

export const mainPageGuard: Guard = async () => {
  const isAuthenticated = authService.isAuthenticated();

  return isAuthenticated ? true : "login";
};
