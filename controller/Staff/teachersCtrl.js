const AsyncHandler = require("express-async-handler");
const Teacher = require("../../model/staff/Teacher");
const { hashPassword, isPassMatched, } = require("../../utils/helpers");
const generateToken = require("../../utils/generateToken");
const Admin = require("../../model/staff/Admin");

//@desc     Admin Register Teacher
//@route    POST/api/teachers/admin/register
//@access   Private

exports.adminRegisterTeacher = AsyncHandler(async(req, res) => {
    const { name, email, password } = req.body;
    // find the admin
    const adminFound = await Admin.findById(req.userAuth._id);
    if(!adminFound) {
        throw new Error("Admin not found ")
    }
    // check if teacher already exist
    const teacher = await Teacher.findOne({ email });
    if(teacher){
        throw new Error("Teacher already employed")
    }
    //Hash password
    const hashedPassword = await hashPassword(password);
    // create
    const teacherCreated = await Teacher.create({
        name,
        email,
        password: hashedPassword, 
    });
    // push teacher into admin
    adminFound.teachers.push(teacherCreated?._id);
    await adminFound.save();
    // send teacher data
    res.status(201).json({
        status: "success",
        message: "Teacher registered successfully",
        data: teacherCreated,
    });
});

//@desc     login a Teacher
//@route    POST/api/v1/teachers/login
//@access   Public

exports.loginTeacher = AsyncHandler(async(req, res) => {
    const { email, password, } = req.body;
    // find the user
    const teacher = await Teacher.findOne({email});
    if(!teacher){
        return res.json({ message: "Invalid email login credentials" });
    }
    // verify the password
    const isMatched = await isPassMatched(password, teacher.password);
    if(!isMatched){
        return res.json({ message: "Invalid password login credentials" });
    }else{
        res.status(200).json({
            status: "succes",
            message: "Teacher logged in successfully",
            data: generateToken(teacher?._id),
        });
    }
});

//@desc     Get all Teachers
//@route    GET/api/v1/admin/teachers
//@access   Private admin only

exports.getAllTeachersAdmin = AsyncHandler(async(req, res) => {
    res.status(200).json(res.results);
});

//@desc     Get single Teachers
//@route    GET/api/v1/teachers/:teacherId/admin
//@access   Private admin only

exports.getTeacherByAdmin = AsyncHandler(async(req, res) => {
    const teacherID = req.params.teacherID;
    // find the teacher
    const teacher = await Teacher.findById(teacherID);
    if(!teacher){
        throw new Error("Teacher not found")
    }
    res.status(200).json({
        status: "success",
        message: "Teacher fetched successfully",
        data: teacher,
    });
})

//@desc     Teacher Profile
//@route    GET/api/v1/teachers/profile
//@access   Private admin only

exports.getTeacherProfile = AsyncHandler(async(req, res) => {
    const teacher = await Teacher.findById(req.userAuth?._id).select("-password -createdAt -updatedAt")
    if(!teacher){
        throw new Error("Teacher not found");
    }
    res.status(200).json({
        status: "success",
        data: teacher,
        message: "Teacher Profile fetched succcessfully",
    })
});

//@desc     Teacher updating profile Admin
//@route    UPDATE /api/teachers/:teacherID/update
//@access   Private Teacher only

exports.teacherUpdateProfile =AsyncHandler(async (req, res) => {
    const {email, name, password} = req.body
    //if email is taken
    const emailExist = await Teacher.findOne({email})
    if(emailExist){
        throw new Error ("This email is already taken/existing")
    }
    
    // hash password
    
    //check if user is updating password
    
    if(password){
        //update
        const teacher = await Teacher.findByIdAndUpdate(
            req.userAuth._id, {
                email,
                password: await hashPassword(password),
              name,
            },
            {
                new: true,
                runValidators: true, 
            }
        );
        res.status(200).json({
            status: "success",
            data: teacher,
            message: "Teacher updated successfully",
        })
    }else{
        //update
        const teacher = await Teacher.findByIdAndUpdate(
            req.userAuth._id,
            {
                email,
                name,
            },
            {
                new: true,
                runValidators: true, 
            }
        );
        res.status(200).json({
            status: "success",
            data: teacher,
            message: "Teacher updated successfully",
    })
    }
    
});

//@desc      Admin updating Teacher profile 
//@route    UPDATE /api/teachers/:teacherID/admin
//@access   Private Admin only

exports.adminUpdateTeacher =AsyncHandler(async (req, res) => {
    const {program, classLevel, academicYear, subject} = req.body
    //if email is taken
    const teacherFound = await Teacher.findById(req.params.teacherID)
    if(!teacherFound){
        throw new Error ("Teacher not found")
    }
    // check if teacher is withdrawn
    if(teacherFound.isWithdrawn){
        throw new Error ("Action denied, teacher is withdrawn")
    }
    // assign a program
    if(program){
        teacherFound.program = program;
        await teacherFound.save();
        res.status(200).json({
            status: "success",
            data: teacherFound,
            message: "Teacher updated successfully",
        });
    }

    // assign a Class level
    if(classLevel){
        teacherFound.classLevel = classLevel;
        await teacherFound.save();
        res.status(200).json({
            status: "success",
            data: teacherFound,
            message: "Teacher updated successfully",
        });
    }

    // assign Academic Year
    if(academicYear){
        teacherFound.academicYear = academicYear;
        await teacherFound.save();
        res.status(200).json({
            status: "success",
            data: teacherFound,
            message: "Teacher updated successfully",
        });
    }

    // assign Subject
    if(subject){
        teacherFound.subject = subject;
        await teacherFound.save();
        res.status(200).json({
            status: "success",
            data: teacherFound,
            message: "Teacher updated successfully",
        });
    }

});