const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const mongoose = require("mongoose");
const connectingDB = require("./config/db.js");
const { errorHandler } = require("./middleware/errorHandler.js");
const cors = require("cors");
connectingDB();
app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: false }));

app.use("/users", require("./routes/userRoutes.js"));
app.use(errorHandler);
app.use("/ads", require("./routes/adRoutes.js"));

// mongoose
//   .connect(process.env.MONGO_DB_URL)
//   .then(() => console.log("Connected with mongoose:)"))
//   .catch((err) => console.log(err));

const courseSchema = new mongoose.Schema({
  title: String,
  teacher: String,
  modules: [String],
  date: { type: Date, default: Date.now },
});

const Course = mongoose.model("Course", courseSchema);

// @Create
const createRecord = async () => {
  const result = await Course.create({
    title: "Javascript",
    teacher: "Martynas",
    modules: ["JS", "React"],
  });
  console.log(result);
};
//createRecord();

// @Save
const recordToDB = async () => {
  const course = new Course({
    title: "Python",
    teacher: "Vytautas",
    modules: ["Python"],
  });
  const result = await course.save();
  console.log(result);
};
//recordToDB();

// @ get data
const getCourses = async () => {
  const myCourses = await Course.find();
  console.log(myCourses);
};
//getCourses();

// @ get By ID
const findOneCourse = async (id) => {
  const course = await Course.findById(id);
  console.log(course);
};
//findOneCourse("67a9db42bbf3e9546f9ab903");

// Get one by custom params
const findOneCoursePar = async (id) => {
  const course = await Course.findOne({ teacher: "Martynas" });
  console.log(course);
};
//findOneCoursePar();

// @ filtering
// eq/ne (equal/not equal)
// gt/gte (greater than/greater than or equal to)
// lt/lte (less than/less than or equal to)
// in/nin (includes/not included)
const getFilteredCourses = async () => {
  //const filteredCourse = await Course.find({teacher: { $nin: ["Vytautas"] },}); // can add .sort({ param:1/-1}) .limit(count)

  //const filteredCourse = await Course.find().or([{ teacher: { $in: ["Martynas", "Vytautas"] } },]);
  //const filteredCourse = await Course.find().and([{ teacher: { $in: ["Martynas", "Vytautas"] } },]);
  const filteredCourse = await Course.find({
    teacher: /au/,
  });
  console.log(filteredCourse);
};
//getFilteredCourses();

// @ counting
const getCoursesNumber = async () => {
  const countedCourse = await Course.find().countDocuments();
  console.log(countedCourse);
};
//getCoursesNumber();

// @ Update
const updatedCourse = async (id) => {
  const course = await Course.findById(id);
  if (!course || course.isPublished) return;
  course.modules.push("Typescript");
  const result = await course.save();
  console.log(result);
};
//updatedCourse("67a9d9ef8e1d04b53e5006a4");

// @ update One, Overwrites existing values with new ones with $set
const updatedCourseOne = async (id) => {
  const result = await Course.updateOne(
    { _id: id },
    {
      $set: {
        modules: ["PythonScript", "React", "ScriptScript"],
      },
    }
  );
  console.log(result);
};
//updatedCourseOne("67a9d9ef8e1d04b53e5006a4");
const updatedCourseId = async (id) => {
  const result = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        modules: ["IAmChanged", "SoAmI", "SCRIPT"],
      },
    },
    { new: true }
  );
  console.log(result);
};
//updatedCourseId("67a9d9ef8e1d04b53e5006a4");

// @ Delete
const delteCourse = async (id) => {
  const course = await Course.deleteOne({ _id: id });
  console.log(course);
};
//delteCourse("67a9d9ef8e1d04b53e5006a4");
const deleteCourses = async () => {
  // deletes all that match conditions
  const course = await Course.deleteMany({ teacher: "Vytautas" });
};
deleteCourses();
const PORT = process.env.PORT || 999;
app.listen(PORT, () => console.log(`server is UP on port: ${PORT}`));
