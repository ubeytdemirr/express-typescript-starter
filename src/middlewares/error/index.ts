import ApiError from "@classes/error";
const errorHandler = (error, _req, res, _next) => {
  if (error && !res.headersSent) {
    const errorResponse =
      error instanceof ApiError
        ? error
        : new ApiError(500, error.message, true);
    res.status(errorResponse.code).send(errorResponse);
  }
};

export default errorHandler;
