import { Router } from "express";

import passport from "@utils/passport/passport";

import tokenHandler from "@middlewares/TokenHandler/TokenHandler";

import Users from "./users.schema";

import ApiError from "@classes/ApiError/ApiError";

const router = Router();

router.post("/register", passport.authenticate("auth.register"), tokenHandler);

router.post("/login", passport.authenticate("auth.login"), tokenHandler);

router.get("/me", passport.authenticate("auth.jwt"), tokenHandler);

router.get("/:id", passport.authenticate("scope.me"), tokenHandler);

router.put(
  "/:id",
  passport.authenticate("scope.me"),
  async (req, res, next) => {
    try {
      const user = await Users.findByIdAndUpdate(req.params.id, req.body);
      res.send(user);
    } catch (e) {
      next(new ApiError(500, "Update profile is not successfull", false));
    }
  }
);

router.delete(
  "/:id",
  passport.authenticate("scope.me"),
  async (req, res, next) => {
    try {
      const user = await Users.findByIdAndDelete(req.params.id);
      res.send(user);
    } catch (e) {
      next(new ApiError(500, "Delete profile is not successfull", false));
    }
  }
);

export default router;
