const { validationResult } = require("express-validator");
const { Course } = require("../models/course.model");
const httpsStatusText = require("../utils/httpsStautsText");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError");

const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({ status: httpsStatusText.SUCCESS, data: { courses }});
});

const getSingleCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    const error = appError.create(
      "course not found",
      404,
      httpsStatusText.FAIL
    );
    return next(error);
  }
  res.json({ status: httpsStatusText.SUCCESS, data: { course } });
});

const addCourse = asyncWrapper(async (req, res, next) => {
  const course = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpsStatusText.FAIL);
    return next(error);
  }
  const newCourse = new Course(course);
  await newCourse.save();

  res
    .status(201)
    .json({ status: httpsStatusText.SUCCESS, data: { course: newCourse } });
});

const editCourse = async (req, res) => {
  try {
    const course = await Course.updateOne(
      { _id: req.params.courseId },
      { $set: { ...req.body } }
    );

    res.json({ status: httpsStatusText.SUCCESS, data: { course } });
  } catch (error) {
    return res.status(400).json({
      status: httpsStatusText.ERROR,
      data: null,
      msg: error.message,
      code: 400,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.deleteOne({ _id: courseId });

    res.send({ status: httpsStatusText.SUCCESS, data: null });
  } catch (error) {
    return res.status(400).json({
      status: httpsStatusText.ERROR,
      data: null,
      msg: error.message,
      code: 400,
    });
  }
};

module.exports = {
  getAllCourses,
  getSingleCourse,
  addCourse,
  editCourse,
  deleteCourse,
};
