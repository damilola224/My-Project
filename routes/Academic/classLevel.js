const express = require("express");

const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");
const {
    createClassLevel,
    deleteClassLevel, 
    getClassLevel,
    getClassLevels,
    updateClassLevel
} = require("../../controller/Academics/classLevel");
const classLevelRouter = express.Router();

// classLevelRouter.post("/", isLogin, isAdmin, createAcademicTerm);
// classLevelRouter.get("/", isLogin, isAdmin, getAcademicTerms);

classLevelRouter  
    .route("/")
    .post(isLogin, isAdmin, createClassLevel)
    .get(isLogin, isAdmin, getClassLevels);


classLevelRouter
    .route("/:id")
    .get(isLogin, isAdmin, getClassLevel)
    .put(isLogin, isAdmin, updateClassLevel)
    .delete(isLogin, isAdmin, deleteClassLevel);
    
// classLevelRouter.get("/:id", isLogin, isAdmin, getAcademicTerm);
// classLevelRouter.put("/:id", isLogin, isAdmin, updateAcademicTerm);
// classLevelRouter.delete("/:id", isLogin, isAdmin, deleteAcademicTerm);
module.exports = classLevelRouter;