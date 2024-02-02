const express = require("express");
const isTeacher = require("../../middlewares/isTeacher");
const isTeacherLogin = require("../../middlewares/isTeacherLogin");
const { createQuestion, getQuestions, getQuestion, updateQuestion } = require("../../controller/Academics/questionCtrl");

const questionRouter = express.Router();

questionRouter.get("/", isTeacherLogin, isTeacher, getQuestions);
questionRouter.get("/:id", isTeacherLogin, isTeacher, getQuestion);
questionRouter.post("/:examID", isTeacherLogin, isTeacher, createQuestion);
questionRouter.put("/:id", isTeacherLogin, isTeacher, updateQuestion);

module.exports = questionRouter;