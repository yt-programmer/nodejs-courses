// CRUD (create , read , update , delete)
require("dotenv").config();
const httpStatusText = require("./utils/httpsStautsText");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 4000;
const url = process.env.DB_URL;
const cors = require("cors");
mongoose.connect(url).then(() => console.log("DB connected"));
const path = require("path");
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const UserRouter = require("./routes/users.routes");
const CourseRouter = require("./routes/courses.routes");
const appError = require("./utils/appError");
app.use("/api/users", UserRouter);
app.use("/api/courses", CourseRouter);
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    status: err.statusText || httpStatusText.ERROR,
    msg: err.message,
    code: err.statusCode || 500,
    data: null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
