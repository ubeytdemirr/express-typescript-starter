import Users from "./users.schema";
import UsersRouter from "./users.route";
import * as UserConstants from "./users.constants";

export const router = UsersRouter;
export const constants = UserConstants;
export const model = Users;
