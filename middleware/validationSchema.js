const { body } = require("express-validator");

const validator = [
  body("title")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("title must be at least 3 chars"),
  body("price").isNumeric().notEmpty().withMessage("price is required"),
];

module.exports = { validator };
