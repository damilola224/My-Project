const Teacher = require("../model/staff/Teacher");

const isTeacher = async (req, res, next) =>{
    //find the user
    const userId = req?.userAuth?._id
    const teacherFound = await Teacher.findById(userId);
    //check if admin
    if(teacherFound?.role === "teacher"){
        next()
    }else{
        next(new Error("Access denied, Teachers only"))
    }
};

module.exports = isTeacher;