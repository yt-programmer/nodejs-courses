const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../models/user.model");
const appError = require("../utils/appError");
const httpsStatusText = require("../utils/httpsStautsText");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const genratreJWT = require("../utils/genratreJWT");
const { userRoles } = require("../utils/userRoles");

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  res.json({ status: httpsStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  console.log(req.body);
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return next(
      appError.create("user already exists", 400, httpsStatusText.FAIL)
    );
  }

  //password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
    role: role,
    avatar: req.file.filename,
  });

  const token = await genratreJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;
  await newUser.save();

  res
    .status(201)
    .json({ status: httpsStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      appError.create(
        "email and password are required",
        400,
        httpsStatusText.FAIL
      )
    );
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(appError.create("user not found", 400, httpsStatusText.FAIL));
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(
      appError.create("invalid credentials", 400, httpsStatusText.FAIL)
    );
  }
  const token = await genratreJWT({
    role: user.role,
    email: user.email,
    id: user._id,
  });

  res.json({ status: httpsStatusText.SUCCESS, data: { token: token } });
});
module.exports = { getAllUsers, register, login };
