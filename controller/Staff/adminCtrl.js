const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/staff/Admin");
const generateToken = require("../../utils/generateToken");
const verifyToken = require("../../utils/verifyToken");
const bcrypt = require("bcryptjs");
const { hashPassword, isPassMatched } = require("../../utils/helpers");

//@desc     Register Admin
//@route    POST/api/admins/register
//@access   Private 
exports.registerAdmCtrl = AsyncHandler(async (req, res) => {
    const {   name, email, password } = req.body
    //check if email exists
    const adminFound = await Admin.findOne({ email });
    if(adminFound){
        res.json('Admin Exists')
    }
    
    //register
    const user = await Admin.create({
        name, 
        email, 
        password: await hashPassword(password),
    });
    res.status(201).json({
        status: "success",
        data : user,
        message: "Admin registered successfully",
    }); 
});

//@desc     Login Admin
//@route    POST/api/admins/login
//@access   Private 
exports.loginAdminCtrl = AsyncHandler(async (req, res) => {
    const { email, password } = req.body
    //find user
    const user = await Admin.findOne({email});
    if(!user){
        return res.json({message: "Invalid login email credentials"})
    }
    //verify password
    const isMatched = await isPassMatched(password, user.password);

    if(!isMatched) {
        return res.json ({message: "Invalid login password2 credentials"})
    }else{
        return res.json({ 
            data: generateToken(user._id),
            message: "Admin logged in successfully"
        });
    }
}); 

//@desc     Get All Admin
//@route    GET /api/admins
//@access   Private 
exports.getAdminsCtrl =AsyncHandler(async (req, res) => {
    res.status(200).json(res.results)
});

//@desc     Get Single Admin
//@route    GET /api/admins/:id
//@access   Private 
exports.getAdminProfileCtrl = AsyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.userAuth._id)
    .select("-password -createdAt -updatedAt")
    .populate("academicYears")
    .populate("academicTerms")
    .populate("programs")
    .populate("yearGroups")
    .populate("classLevels")
    .populate("teachers")
    .populate("students")
    if(!admin){
        throw new Error('Admin Not Found')
    }else{
        res.status(200).json({
            status: "succes",
            data: admin,
            message: "Admin Profile fetched successfully",
        });
    }
});

//@desc     Update Admin
//@route    UPDATE /api/admins/:id
//@access   Private 
exports.updateAdminCtrl =AsyncHandler(async (req, res) => {
    const {email, name, password} = req.body
    //if email is taken
    const emailExist = await Admin.findOne({email})
    if(emailExist){
        throw new Error ("This email is already taken/existing")
    }
    
    // hash password
    
    //check if user is updating password
    
    if(password){
        //update
        const admin = await Admin.findByIdAndUpdate(
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
            data: admin,
            message: "Admin updated successfully",
        })
    }else{
        //update
        const admin = await Admin.findByIdAndUpdate(
            req.userAuth._id, {
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
            data: admin,
            message: "Admin updated successfully",
    })
    }
    
});

//@desc     Delete Admin
//@route    DELETE /api/admins/:id
//@access   Private 
exports.deleteAdminCtrl =  (req, res) => { 
    try {
        res.status(201).json({
            status: "succes",
            data : "Delete admin",
        });
    } catch (error) {
        res.json({
          status: "failed",
          error: error.message,
        });
    }
};

//@desc     Admin suspends a teacher
//@route    PUT /api/admins/suspend/teacher/:id
//@access   Private 
exports.adminSuspendTeacherCtrl = (req, res) => {
    try {
        res.status(201).json({
            status: "succes",
            data : "admin suspend teacher",
        });
    } catch (error) {
        res.json({
          status: "failed",
          error: error.message,
        });
    }
};

//@desc     Admin unsuspends a teacher
//@route    PUT /api/admins/unsuspend/teacher/:id
//@access   Private 
exports.adminUnSuspendTeacherCtrl =  (req, res) => {
    try {
        res.status(201).json({
            status: "succes",
            data : "admin unsuspend teacher",
        });
    } catch (error) {
        res.json({
          status: "failed",
          error: error.message,
        });
    }
};

//@desc     Admin withdraws a teacher
//@route    PUT /api/admins/withdraw/teacher/:id
//@access   Private
exports.adminWithdrawTeacherCtrl =  (req, res) => {
    try {
        res.status(201).json({
            status: "succes",
            data : "admin withdraw teacher",
        });
    } catch (error) {
        res.json({
          status: "failed",
          error: error.message,
        });
    }
};

//@desc     Admin unwithdraws a teacher
//@route    PUT /api/admins/unwithdraw/teacher/:id
//@access   Private 
exports.adminUnWithdrawTeacherCtrl =  (req, res) => {
    try {
        res.status(201).json({
            status: "succes",
            data : "admin unwithdraw teacher",
        });
    } catch (error) {
        res.json({
          status: "failed",
          error: error.message,
        });
    }
};

//@desc     Admin publish exam result
//@route    PUT /api/admins/publish/exam/:id
//@access   Private 
exports.adminPublishResultCtrl =  (req, res) => {
    try {
        res.status(201).json({
            status: "succes",
            data : "admin publish exam",
        });
    } catch (error) {
        res.json({
          status: "failed",
          error: error.message,
        });
    }
};

//@desc     Admin unpublish exam result
//@route    PUT /api/admins/unpublish/exam/:id
//@access   Private 
exports.adminUnPublishResultCtrl = (req, res) => {
    try {
        res.status(201).json({
            status: "succes",
            data : "admin unpublish exam",
        });
    } catch (error) {
        res.json({
          status: "failed",
          error: error.message,
        });
    }
};