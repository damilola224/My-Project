const express = require("express");

const isAdmin = require("../../middlewares/isAdmin");
const isLogin = require("../../middlewares/isLogin");
const {
    createProgram,
    deleteProgram, 
    getProgram,
    getPrograms,
    updateProgram
} = require("../../controller/Academics/program");
const programRouter = express.Router();

// programRouter.post("/", isLogin, isAdmin, createAcademicTerm);
// programRouter.get("/", isLogin, isAdmin, getAcademicTerms);

programRouter  
    .route("/")
    .post(isLogin, isAdmin, createProgram)
    .get(isLogin, isAdmin, getPrograms);


programRouter
    .route("/:id")
    .get(isLogin, isAdmin, getProgram)
    .put(isLogin, isAdmin, updateProgram)
    .delete(isLogin, isAdmin, deleteProgram);
    
// programRouter.get("/:id", isLogin, isAdmin, getAcademicTerm);
// programRouter.put("/:id", isLogin, isAdmin, updateAcademicTerm);
// programRouter.delete("/:id", isLogin, isAdmin, deleteAcademicTerm);
module.exports = programRouter;