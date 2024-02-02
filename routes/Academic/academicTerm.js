const express = require("express");

const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");
const { 
    createAcademicTerm,
    deleteAcademicTerm,
    getAcademicTerm,
    getAcademicTerms,
    updateAcademicTerms,
} = require("../../controller/Academics/academicTermCtrl");
const academicTermRouter = express.Router();

// academicTermRouter.post("/", isLogin, isAdmin, createAcademicTerm);
// academicTermRouter.get("/", isLogin, isAdmin, getAcademicTerms);

academicTermRouter  
    .route("/")
    .post(isLogin, isAdmin, createAcademicTerm)
    .get(isLogin, isAdmin, getAcademicTerms);


academicTermRouter
    .route("/:id")
    .get(isLogin, isAdmin, getAcademicTerm)
    .put(isLogin, isAdmin, updateAcademicTerms)
    .delete(isLogin, isAdmin, deleteAcademicTerm);
    
// academicTermRouter.get("/:id", isLogin, isAdmin, getAcademicTerm);
// academicTermRouter.put("/:id", isLogin, isAdmin, updateAcademicTerm);
// academicTermRouter.delete("/:id", isLogin, isAdmin, deleteAcademicTerm);
module.exports = academicTermRouter;