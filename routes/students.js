const express = require("express");
const router = express.Router();

const {
  getStudents,
  addStudent,
  getNewStudent,
  editStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/students.js");

router.route("/students")
    .get(getStudents)
    .post(addStudent);
router.route("/students/new")
    .get(getNewStudent);
router.route("/students/edit/:id")
    .get(editStudent);
router.route("/students/update/:id")
    .post(updateStudent);
router.route("/students/delete/:id")
    .post(deleteStudent)

module.exports = router;