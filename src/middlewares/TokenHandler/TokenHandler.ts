import ApiError from "@classes/ApiError/ApiError";

const tokenHandler = (req: any, res, next) => {
  try {
    if(req.originalUrl.includes("/api/users/me")){

      res.status(202).send(req.user);
    }
    else{

      if (req.query.returnToken==='true') {
        res.status(202).send(req.user);
      } else {
        res.cookie("accessToken", req.user.accessToken);
        res.cookie("refreshToken", req.user.refreshToken);
        delete req.user.accessToken
        delete req.user.refreshToken
        res.send(req.user);
      }
    }
  } catch (e) {
    next(new ApiError(500, "An error occured.", true));
  }
};

export default tokenHandler;
