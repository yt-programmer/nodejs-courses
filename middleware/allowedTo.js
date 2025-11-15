const appError = require("../utils/appError");
const httpsStatusText = require("../utils/httpsStautsText");
const { userRoles } = require("../utils/userRoles");
const allowedTo = (...roles) => {
  return (req, res, next) => {
    req.currentUser.role;

    if (!roles.includes(req.currentUser.role)) {
      return next(
        appError.create(
          "You are not authorized to access this route",
          403,
          httpsStatusText.FAIL
        )
      );
    }
    next();
  };
};

module.exports = { allowedTo };
