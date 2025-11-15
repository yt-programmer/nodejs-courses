const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getSingleCourse,
  addCourse,
  editCourse,
  deleteCourse,
} = require("../controllers/courses.controller");
const { validator } = require("../middleware/validationSchema");
const verfiyToken = require("../middleware/verfiyToken");
const { allowedTo } = require("../middleware/allowedTo");
const { userRoles } = require("../utils/userRoles");

router
  .route("/")
  .get(getAllCourses)
  .post(verfiyToken, allowedTo(userRoles.MANAGER), validator, addCourse);

router
  .route("/:courseId")
  .get(getSingleCourse)
  .patch(editCourse)
  .delete(
    verfiyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    deleteCourse
  );

module.exports = router;
