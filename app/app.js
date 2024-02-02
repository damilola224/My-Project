const express = require('express');
const morgan = require('morgan');
const adminRouter = require('../routes/Staff/adminRouter');
const {globalErrHandler, notFoundErr} = require('../middlewares/globalErrHandler');

const academicYearRouter = require('../routes/Academic/academicYear');
const academicTermRouter = require('../routes/Academic/academicTerm');
const classLevelRouter = require('../routes/Academic/classLevel');
const programRouter = require('../routes/Academic/program');
const subjectRouter = require('../routes/Academic/subjects');
const yearGroupRouter = require('../routes/Academic/yearGroup');
const teachersRouter = require('../routes/Staff/teachers');
const examRouter = require('../routes/Academic/examRoute');
const studentRouter = require('../routes/Staff/student');
const questionRouter = require('../routes/Academic/questionRoutes');
const examResultRouter = require('../routes/Academic/examResultRoute');


const app = express();

// MiddleWares
app.use(morgan("dev"));
app.use(express.json());//pass incoming json

// Routes
//admin register
app.use('/api/v1/admins', adminRouter);
app.use("/api/v1/academic-years", academicYearRouter); 
app.use("/api/v1/academic-terms", academicTermRouter);
app.use("/api/v1/class-levels", classLevelRouter);
app.use("/api/v1/programs", programRouter);
app.use("/api/v1/subjects", subjectRouter);
app.use("/api/v1/year-groups", yearGroupRouter);
app.use("/api/v1/teachers", teachersRouter);
app.use("/api/v1/exams", examRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/exam-results", examResultRouter);

//Error middlewares
app.use(notFoundErr);
app.use(globalErrHandler);


module.exports = app;
 