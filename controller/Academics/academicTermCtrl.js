const AsyncHandler = require("express-async-handler");
const AcademicTerm = require("../../model/Academic/AcademicTerm");
const Admin = require("../../model/staff/Admin");

//@desc     Create Academic Term
//@route    POST/api/v1/academic-term
//@access   Private 
exports.createAcademicTerm = AsyncHandler (async(req, res) => {
    const { name, description, duration, } = req.body;
    //check if exists
    const academicTerm = await AcademicTerm.findOne({name});
    if(academicTerm){
        throw new Error('Academic term already exists')
    }
    //create
    const academicTermCreated = await AcademicTerm.create({
        name, 
        description, 
        duration,
        createdBy: req.userAuth._id
    });
    //Push academic into admin
    const admin = await Admin.findById(req.userAuth._id);
    admin.academicTerms.push(academicTermCreated._id);
    await admin.save(); 
    res.status(201).json({
        status: "success",
        message: "Academic term created successfully",
        data: academicTermCreated,
    });
});

//@desc     get all Academic Terms
//@route    GET/api/v1/academic-terms
//@access   Private 
exports.getAcademicTerms = AsyncHandler (async(req, res) => {
    const academicTerms = await AcademicTerm.find();
    
    res.status(201).json({
        status: "success",
        message: "Academic terms fetched successfully",
        data: academicTerms,
    });
});

//@desc     get single Academic Term
//@route    GET/api/v1/academic-terms/:id
//@access   Private 
exports.getAcademicTerm = AsyncHandler (async(req, res) => {
    const academicTerms = await AcademicTerm.findById(req.params.id);
    
    res.status(201).json({
        status: "success",
        message: "Academic terms fetched successfully",
        data: academicTerms,
    });
});

//@desc     update Academic Term
//@route    PUT/api/v1/academic-terms/:id
//@access   Private 
exports.updateAcademicTerms = AsyncHandler (async(req, res) => {
    const { name, description, duration, } = req.body;
    // check if name exists
    const createAcademicTermFound = await AcademicTerm.findOne({name});
    if(createAcademicTermFound){
        throw new Error("Academic term already exists");
    }
    const academicTerms = await AcademicTerm.findByIdAndUpdate(
        req.params.id,
        {
            name,
            description,
            duration,
            createdBy: req.userAuth._id,
        },
        {
            new: true,
        }
    );
    
    res.status(201).json({
        status: "success",
        message: "Academic Term updated successfully",
        data: academicTerms,
    });
});

//@desc     delete Academic term
//@route    DELETE/api/v1/academic-terms/:id
//@access   Private 
exports.deleteAcademicTerm = AsyncHandler (async(req, res) => {
    await AcademicTerm.findByIdAndDelete(
        req.params.id
    );
    
    res.status(201).json({
        status: "success",
        message: "Academic term deleted successfully",
    });
});