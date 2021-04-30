import {Router} from "express";

import usersRouter from '@services/users/users.route';

const router = Router();

router.use("/users",usersRouter)

export default router;
