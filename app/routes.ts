export type AppRoutes =
  | "/"
  | "/properties"
  | "/dashboard"
  | "/dashboard/analytics"
  | "/dashboard/properties"
  | "/dashboard/users"
  | "/auth/login"
  | "/auth/forgot-password"
  | "/auth/reset-password";

export type LayoutRoutes =
  | "/"
  | "/dashboard";

export type ParamMap = {
  "/": {};
  "/properties": {};
  "/dashboard": {};
  "/dashboard/analytics": {};
  "/dashboard/properties": {};
  "/dashboard/users": {};
  "/auth/login": {};
  "/auth/forgot-password": {};
  "/auth/reset-password": {};
};