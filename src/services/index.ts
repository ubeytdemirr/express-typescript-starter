import { Router } from "express";

import { router as userService } from "@services/users";

import testService from "./test";

const router = Router();

router.use("/users", userService);

router.use("/test", testService);

export default router;
