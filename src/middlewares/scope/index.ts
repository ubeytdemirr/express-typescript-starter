import ApiError from "@classes/error";

export default function authorization(scope) {
  return function (req, _res, next) {
    if (req.user.scopes) {
      const hasScope = req.user.scopes.some(
        (s) => s.operations.includes(scope.operation) && s.name === scope.name
      );
      if (!hasScope)
        next(
          new ApiError(
            403,
            `Insufficient user role for ${scope.operation.toLowerCase()} ${scope.name.toLowerCase()}`,
            false
          )
        );
      else next();
    } else {
      next(new ApiError(403, `User does not have defined scope.`, false));
    }
  };
}
