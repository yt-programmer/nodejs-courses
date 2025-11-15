const jwt = require("jsonwebtoken");
const httpsStatusText = require("../utils/httpsStautsText");
const appError = require("../utils/appError");
const verfiyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];

  const token = authHeader?.split(" ")[1];
  if (!authHeader) {
    return next(appError.create("token not found", 401, httpsStatusText.FAIL));
  }
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (error) {
    return next(appError.create("Unauthorized", 401, httpsStatusText.ERROR));
  }
};

module.exports = verfiyToken;
