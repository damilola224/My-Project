const AsyncHandler = require("express-async-handler"); 
const Student = require("../../model/Academic/Student");
const { hashPassword, isPassMatched } = require("../../utils/helpers");
const generateToken = require("../../utils/generateToken");
const Exam = require("../../model/Academic/Exam");
const ExamResult = require("../../model/Academic/ExamResults");
const Admin = require("../../model/staff/Admin");

//@desc     Admin Register Student
//@route    POST/api/students/admin/register
//@access   Private Admin only

exports.adminRegisterStudent = AsyncHandler(async(req, res) => {
    const { name, email, password } = req.body;
    // find the admin
    const adminFound = await Admin.findById(req.userAuth._id);
    if(!adminFound) {
        throw new Error("Admin not found ")
    }
    // check if Student already exist
    const student = await Student.findOne({ email });
    if(student){
        throw new Error("Student already exist")
    }
    //Hash password
    const hashedPassword = await hashPassword(password);
    // create
    const studentRegistered = await Student.create({
        name,
        email,
        password: hashedPassword, 
    });
    // push teacher into admin
    adminFound.students.push(studentRegistered?._id);
    await adminFound.save();
    // send Student data
    res.status(201).json({
        status: "success",
        message: "Student registered successfully",
        data: studentRegistered,
    });
});

//@desc     login a Student
//@route    POST/api/v1/students/login
//@access   Public
exports.loginStudent = AsyncHandler(async(req, res) => {
    const { email, password, } = req.body;
    // find the user
    const student = await Student.findOne({email});
    if(!student){
        return res.json({ message: "Invalid email login credentials" });
    }
    // verify the password
    const isMatched = await isPassMatched(password, student?.password);
    if(!isMatched){
        return res.json({ message: "Invalid password login credentials" });
    }else{
        res.status(200).json({
            status: "succes",
            message: "Student logged in successfully",
            data: generateToken(student?._id),
        });
    }
});

//@desc     Student Profile
//@route    GET/api/v1/students/profile
//@access   Private Student only
exports.getStudentProfile = AsyncHandler(async(req, res) => {
    const student = await Student.findById(req.userAuth?._id)
    .select("-password -createdAt -updatedAt")
    // .populate("examResults");
    if(!student){
        throw new Error("Student not found");
    }
    // console.log("students = ",student);
    // get student profile
    const studentProfile = {
        name: student?.name,
        email: student?.email,
        currentClassLevel: student?.currentClassLevel,
        program: student?.program,
        dateAdmitted: student?.dateAdmitted,
        isSuspended: student?.isSuspended,
        isWithdrawn: student?.isWithdrawn,
        studentId: student?.studentId,
        prefectName: student?.prefectName,
    }
    // get student exam result
    const examResults = student?.examResults;
    // console.log("examResults = ",examResults);
    // current exam
    const currentExamResultId = examResults && examResults.length > 1 ? examResults[examResults.length - 1] : "";

    
    // send response
    const currentExamResultObj = await ExamResult.findById(currentExamResultId)
    // console.log("currentExamResultObj = ",currentExamResultObj);
    res.status(200).json({
        status: "success",
        data: {
            studentProfile,
            currentExamResultObj: currentExamResultObj.isPublished ? currentExamResultObj: "Check this result later - not available",
        },
        message: "Student Profile fetched succcessfully",
    })
});

//@desc     Get all Students
//@route    GET/api/v1/admin/students
//@access   Private admin only
exports.getAllStudentsByAdmin = AsyncHandler(async(req, res) => {
    const students = await Student.find();
    res.status(200).json({
        status: "success",
        message: "Students fetched successfully",
        data: students,
    });
});

//@desc     Get single Students
//@route    GET/api/v1/students/:studentId/admin
//@access   Private admin only
exports.getStudentByAdmin = AsyncHandler(async(req, res) => {
    const studentID = req.params.studentID;
    // find the Student
    const student = await Student.findById(studentID);
    if(!student){
        throw new Error("Student not found")
    }
    res.status(200).json({
        status: "success",
        message: "Student fetched successfully",
        data: student,
    });
}) 

//@desc     Student updating profile
//@route    UPDATE /api/students/update
//@access   Private Student only
exports.studentUpdateProfile =AsyncHandler(async (req, res) => {
    const {email, password} = req.body
    //if email is taken
    const emailExist = await Student.findOne({email})
    if(emailExist){
        throw new Error ("This email is already taken/existing")
    }
    
    // hash password
    
    //check if user is updating password
    
    if(password){
        //update
        const student = await Student.findByIdAndUpdate(
            req.userAuth._id, {
                email,
                password: await hashPassword(password),
            },
            {
                new: true,
                runValidators: true, 
            }
        );
        res.status(200).json({
            status: "success",
            data: student,
            message: "Student updated successfully",
        })
        console.log()
    }else{
        //update
        const student = await Student.findByIdAndUpdate(
            req.userAuth._id,
            {
                email,
            },
            {
                new: true,
                runValidators: true, 
            }
        );
        res.status(200).json({
            status: "success",
            data: student,
            message: "Student updated successfully",
    })
    }
    
});

//@desc     Admin updating Students e.g: Assigning classes
//@route    UPDATE /api/students/:studentID/update/admin
//@access   Private admin only
exports.adminUpdateStudent = AsyncHandler(async(req, res) => {
    const {
        classLevels,
        academicYear,
        program,
        name,
        email,
        prefectName,
        isSuspended,
        isWithdrawn,
    } = req.body;

    // find the Student by id
    const studentFound = await Student.findById(req.params.studentID);
    if(!studentFound){
        throw new Error("Student not found")
    }

    // update
    const studentUpdated = await Student.findByIdAndUpdate(
        req.params.studentID,
        {
            $set:{
                name, 
                email,
                academicYear,
                program,
                prefectName,
                isSuspended,
                isWithdrawn,
            },
            $addToSet: {
                classLevels,
            },
        },
        {   
            new: true,
        },
    );
    // send response
    res.status(200).json({
        status: "success",
        data: studentUpdated,
        message: "Student updated successfully",
    });
});

//@desc     Student taking exams
//@route    POST /api/students/exams/:examID/write
//@access   Private Students only
exports.writeExam = AsyncHandler(async(req, res)=> {
    // get student
    const studentFound = await Student.findById(req.userAuth?._id);
    if(!studentFound) {
        throw new Error ("Student not found");
    }
    // Get Exam
    const examFound = await Exam.findById(req.params.examID)
        .populate("questions")
        .populate("academicTerm")
    // console.log({examFound});  
    if(!examFound) {
        throw new Error ("Exam not found")
    }
    // get questions
    const questions = examFound?.questions;
    // get students questions
    const studentAnswers = req.body.answers;

    // check if student answered all questions
    if(studentAnswers.length !== questions.length){
        throw new Error("You have not answered all questions🤦🏼‍♂️")
    }

    // // Check if student has already taken the examination
    const studentFoundInResults = await ExamResult.findOne({student: studentFound?._id});
    if(studentFoundInResults){
        throw new Error ("You have already written this examination🥱")
    }

    // Check if student is suspended/Withdrawn
    if (studentFound.isWithdrawn || studentFound.isSuspended){
        throw new Error ("You have been suspended/withdrawn, you can't take this exam")
    }
     
    // Build report object
    let correctanswers = 0;
    let wrongAnswers = 0;
    let status = ""; //failed or passed
    let remarks = "";
    let grade = 0;
    let score = 0;
    let answeredQuestions = [];

    // check for answers
    for(let i=0; i < questions.length; i++){
        // find the question
        const question = questions[i]
        // Check if the answer is correct
        if (question.correctAnswer === studentAnswers[i]){
            correctanswers++;
            score++;
            question.isCorrect = true
        }else{
            wrongAnswers++;
        }
    }

    // calculate reports
    totalQuestion = questions.length;
    grade = (correctanswers / questions.length) * 100;
    answeredQuestions = questions.map(question =>{
        return{
            question: question.question,
            correctanswer: question.correctAnswer, 
            isCorrect: question.isCorrect
        };
    });
    // Calculate status
    if (grade >= 50){
        status = "Pass";
    }else{
        status = "Fail";
    }

    //remarks
    if (grade >= 80) {
        remarks = "Excellent"
    } else if (grade >= 70) {
        remarks = "very good"
    } else if (grade >= 60) {
        remarks = "Good"
    } else if (grade >= 50) {
        remarks = "Fair"
    } else {
        remarks = "Poor"
    }
    
    // // Generate Exam Results
    const examResults = await ExamResult.create({
        studentID: studentFound?.studentId,
        exam: examFound?._id,
        grade,
        score,
        status,
        remarks,
        classLevel: examFound?.classLevel,
        academicTerm: examFound?.academicTerm,
        academicYear: examFound?.academicYear,
        answeredQuestions: answeredQuestions,
    })

    // // push the result into student
    studentFound.examResults.push(examResults?._id);
    // // save 
    await studentFound.save();

    // Promoting student
    // promote student to level 200
    if(examFound.academicTerm.name === "3rd Term" && status === "Pass" && studentFound?.currentClassLevel === "Level 100"){
        studentFound.classLevels.push("Level 200");
        studentFound.currentClassLevel = "Level 200";
        await studentFound.save();
    };

    // promote student to level 300
    if(examFound.academicTerm.name === "3rd Term" && status === "Pass" && studentFound?.currentClassLevel === "Level 200"){
        studentFound.classLevels.push("Level 300");
        studentFound.currentClassLevel = "Level 300";
        await studentFound.save();
    };

    // promote student to level 400
    if(examFound.academicTerm.name === "3rd Term" && status === "Pass" && studentFound?.currentClassLevel === "Level 300"){
        studentFound.classLevels.push("Level 400");
        studentFound.currentClassLevel = "Level 400";
        await studentFound.save();
    };
    
    // promote student to graduate
    if(examFound.academicTerm.name === "3rd Term" && status === "Pass" && studentFound?.currentClassLevel === "Level 400"){
        studentFound.isGraduated = true;
        studentFound.yearGraduated = new Date();
        await studentFound.save();
    };

    res.status(200).json ({
        status: "success",
        data: "You have submitted your exam. Check later for the result"
    })
})