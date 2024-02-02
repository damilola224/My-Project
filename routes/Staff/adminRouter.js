const express = require('express');
const { 
    registerAdmCtrl,
    adminPublishResultCtrl,
    adminSuspendTeacherCtrl,
    adminUnPublishResultCtrl,
    adminUnSuspendTeacherCtrl,
    adminUnWithdrawTeacherCtrl,
    adminWithdrawTeacherCtrl,
    deleteAdminCtrl,
    getAdminProfileCtrl,
    getAdminsCtrl,
    loginAdminCtrl,
    updateAdminCtrl
} = require('../../controller/Staff/adminCtrl');
const isLogin = require('../../middlewares/isLogin');
const isAdmin = require('../../middlewares/isAdmin');
const advancedResults = require('../../middlewares/advancedResults');
const Admin = require('../../model/staff/Admin');
const isAuth = require('../../middlewares/isAuth');
const roleRestriction = require('../../middlewares/roleRestriction');

const adminRouter = express.Router();

//register
adminRouter.post("/register", registerAdmCtrl);
//login
adminRouter.post("/login", loginAdminCtrl);

//get all
adminRouter.get("/", isLogin, advancedResults(Admin), getAdminsCtrl);

//Single
adminRouter.get(
    "/profile",
    isAuth(Admin), 
    roleRestriction("admin"), 
    getAdminProfileCtrl
);

//update
adminRouter.put("/", isLogin, roleRestriction("admin"), updateAdminCtrl);

//delete
adminRouter.delete("/:id",deleteAdminCtrl);

//suspend
adminRouter.put("/suspend/teacher/:id",adminSuspendTeacherCtrl);

// unsuspend
adminRouter.put("/unsuspend/teacher/:id",adminUnSuspendTeacherCtrl);

//withdraw
adminRouter.put("/withdraw/teacher/:id",adminWithdrawTeacherCtrl);

//unwithdraw
adminRouter.put("/unwithdraw/teacher/:id",adminUnWithdrawTeacherCtrl);


//publish exam result
adminRouter.put("/publish/exam/:id", adminPublishResultCtrl);

// unpublish exam result
adminRouter.put("/unpublish/exam/:id",adminUnPublishResultCtrl)

module.exports = adminRouter;