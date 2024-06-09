const Student = require("../models/Student");
const handleErrors = require("../utils/parseErrors");

// GET all students for the current user
const getStudents = async (req, res, next) => {
    try {
        const students = await Student.find({ createdBy: req.user._id });
        res.render('students', { students });
    } catch (error) {
        handleErrors(error, req, res);
    }
};

// POST a new student
const addStudent = async (req, res, next) => {
    try {
        const newStudent = await Student.create({ ...req.body, createdBy: req.user._id });
        res.redirect('/students'); 
    } catch (error) {
        handleErrors(error, req, res);
    }
};

// GET the form for adding a new student
const getNewStudent = async (req, res) => {
    try {
        res.render('newStudent', {}); 
    } catch (error) {
        handleErrors(error, req, res);
    }
};

// GET a specific student for editing
const editStudent = async (req, res, next) => {
    try {
        const student = await Student.findOne({ _id: req.params.id, createdBy: req.user._id });
        if (!student) {
            res.status(404);
            req.flash('error', 'Student not found');
            return;
        }
        res.render('student', { student }); 
    } catch (error) {
        handleErrors(error, req, res); 
    }
};

// POST an updated student
const updateStudent = async (req, res, next) => {
    try {
        const updatedStudent = await Student.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedStudent) {
            res.status(404);
            req.flash('error', 'Student not found');
            return;
        }
        res.redirect('/students');
    } catch (error) {
        handleErrors(error, req, res, '/students/edit/' + req.params.id);
    }
};

// POST to delete a student
const deleteStudent = async (req, res, next) => {
    try {
        const deletedStudent = await Student.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
        if (!deletedStudent) {
            res.status(404);
            req.flash('error', 'Student not found');
            return res.redirect('/students'); 
        }
        req.flash('success', 'Student was deleted');
        res.redirect('/students');
    } catch (error) {
        handleErrors(error, req, res); 
    }
};

module.exports = {
  getStudents,
  getNewStudent,
  addStudent,
  editStudent,
  updateStudent,
  deleteStudent
};