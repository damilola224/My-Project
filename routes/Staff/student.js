const express = require('express');
const isLogin = require('../../middlewares/isLogin');
const isAdmin = require('../../middlewares/isAdmin');
const isStudent = require('../../middlewares/isStudent');
const isStudentLogin = require('../../middlewares/isStudentLogin');
const { 
    adminRegisterStudent, 
    loginStudent,
    getStudentProfile,
    getAllStudentsByAdmin,
    getStudentByAdmin,
    studentUpdateProfile,
    adminUpdateStudent,
    writeExam,
} = require('../../controller/students/studentCtrl');
const isAuth = require('../../middlewares/isAuth');
const Student = require('../../model/Academic/Student');
const roleRestriction = require('../../middlewares/roleRestriction');
const Admin = require('../../model/staff/Admin');
const studentRouter = express.Router();

studentRouter.post("/admin/register", isLogin, isAdmin, adminRegisterStudent);
studentRouter.post("/login", loginStudent);
studentRouter.get(
    "/profile", 
    isAuth(Student), 
    roleRestriction("student"), 
    getStudentProfile
);
studentRouter.get(
    "/admin", 
    isAuth(Admin), 
    roleRestriction("admin"),
    getAllStudentsByAdmin
);
studentRouter.get(
    "/:studentID/admin", 
    isAuth(Student), 
    roleRestriction("admin"),
    getStudentByAdmin
);
studentRouter.post (
    "/exam/:examID/write", 
    isAuth(Student), 
    roleRestriction("student"), 
    writeExam
);
studentRouter.put(
    "/update", 
    isAuth(Student), 
    roleRestriction("student"), 
    studentUpdateProfile
);
studentRouter.put(
    "/:studentID/update/admin", 
    isAuth(Admin), 
    roleRestriction("admin"), 
    adminUpdateStudent
);
module.exports = studentRouter;