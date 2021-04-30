export type feature =
  // MANAGEMENT FEATURES
  "USER_MANAGEMENT" | "TEST";
// USER FEATURES

export type role = "SUDO" | "ADMIN" | "USER";

export type operation = "CREATE" | "READ" | "UPDATE" | "DELETE";

export interface IScope {
  name: feature;
  operations: operation[];
}
export type scopes = IScope[];
export interface IRole {
  name: string;
  scopes: IScope;
}
