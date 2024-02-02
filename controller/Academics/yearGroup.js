const AsyncHandler = require("express-async-handler");
const Admin = require("../../model/staff/Admin");
const YearGroup = require("../../model/Academic/YearGroup")
//@desc     Create year group
//@route    POST/api/v1/years-group/:programID
//@access   Private 
exports.createYearGroup = AsyncHandler (async(req, res) => {
    const { name, academicYear } = req.body;

    //check if exists
    const yeargroup = await YearGroup.findOne({name});
    if(yeargroup){
        throw new Error("Year Group/Graduation already exists");
    }
    //create
    const yearGroup = await YearGroup.create({
        name, 
        academicYear,
        createdBy: req.userAuth._id
    });

    // Push to the YearGroup
    // find the admin
    const admin = await Admin.findById(req.userAuth._id)
    if(!admin){
        throw new Error("Admin not found");
    }
    // push year group into admin
    admin.yearGroups.push(yearGroup._id)
    // save
    await admin.save();
    res.status(201).json({
        status: "success",
        message: "Year Group created successfully",
        data: yearGroup,
    });
});

//@desc     get all YearGroups
//@route    GET/api/v1/year-groups
//@access   Private 
exports.getYearGroups = AsyncHandler (async(req, res) => {
    const groups = await YearGroup.find();
    res.status(201).json({
        status: "success",
        message: "Year Groups fetched successfully",
        data: groups,
    });
});

//@desc     get single Year Group
//@route    GET/api/v1/year-groups/:id
//@access   Private 
exports.getYearGroup = AsyncHandler (async(req, res) => {
    const group = await YearGroup.findById(req.params.id);
    
    res.status(201).json({
        status: "success",
        message: "Year Group fetched successfully",
        data: group,
    });
});

//@desc     update Year Group
//@route    PUT/api/v1/year-groups/:id
//@access   Private 
exports.updateYearGroup = AsyncHandler (async(req, res) => {
    const { name, academicYear} = req.body;
    // check if name exists
    const yearGroupFound = await YearGroup.findOne({name});
    if(yearGroupFound){
        throw new Error("Year Group already exists");
    }
    const yearGroup = await YearGroup.findByIdAndUpdate(
        req.params.id,
        {
            name,
            academicYear,
            createdBy: req.userAuth._id,
        },
        {
            new: true,
        }
    );
    
    res.status(201).json({
        status: "success",
        message: "YearGroup updated successfully",
        data: yearGroup,
    });
});

//@desc     delete Year Group
//@route    DELETE/api/v1/year-groups/:id
//@access   Private 
exports.deleteYearGroup = AsyncHandler (async(req, res) => {
    await YearGroup.findByIdAndDelete(req.params.id);   
    res.status(201).json({
        status: "success",
        message: "Year Group deleted successfully",
    });
});