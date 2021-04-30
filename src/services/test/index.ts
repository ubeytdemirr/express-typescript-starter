import authorization from "@middlewares/scope";
import passport from "@utils/passport";
import { Router } from "express";

const route = Router();

route.get(
  "/",
  passport.authenticate("auth.jwt"),
  authorization({ name: "TEST", operation: "READ" }),
  async (_req, res, _next) => {
    res.send("ok");
  }
);

route.post(
  "/",
  passport.authenticate("auth.jwt"),
  authorization({ name: "TEST", operation: "CREATE" }),
  async (_req, res, _next) => {
    res.send("ok");
  }
);

export default route;
