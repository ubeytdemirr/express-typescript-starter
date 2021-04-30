import cors from "cors";
import ApiError from "@classes/error";
const whiteList =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_PRODUCTION]
    : [process.env.FRONTEND_DEV];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1) {
      // allowed
      callback(null, true);
    } else {
      // Not allowed
      callback(
        new ApiError(401, `Your access has been blocked by CORS.`, false)
      );
    }
  },
};

export default () => cors(corsOptions);
