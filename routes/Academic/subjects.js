const express = require("express");

const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");
const {
    createSubject,
    deleteSubject, 
    getSubject,
    getSubjects,
    updateSubject
} = require("../../controller/Academics/Subject");
const subjectRouter = express.Router();

subjectRouter.post("/:programID", isLogin, isAdmin, createSubject);

subjectRouter.get("/", isLogin, isAdmin, getSubjects);

subjectRouter.get("/", isLogin, isAdmin, getSubject);

subjectRouter.put("/", isLogin, isAdmin, updateSubject);

subjectRouter.delete("/", isLogin, isAdmin, deleteSubject);


subjectRouter
    .route("/:id")
    .get(isLogin, isAdmin, getSubject)
    .put(isLogin, isAdmin, updateSubject)
    .delete(isLogin, isAdmin, deleteSubject);
    
module.exports = subjectRouter;