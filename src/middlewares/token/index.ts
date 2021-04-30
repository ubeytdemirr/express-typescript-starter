import ApiError from "@classes/error";

const tokenHandler = (req: any, res, next) => {
  try {
    res.status(202).send(req.user);
  } catch (e) {
    next(new ApiError(500, "An error occured.", true));
  }
};

export default tokenHandler;
