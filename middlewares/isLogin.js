const Admin = require("../model/staff/Admin");
const verifyToken = require("../utils/verifyToken");

const isLogin = async (req, res, next) =>{
    //get Token from header
    const headerObj = req.headers;
    const token = headerObj?.authorization?.split(" ")[1];
    //verify token
    const verifiedToken = verifyToken(token);
    if (verifiedToken) {
        // find the admin
        const user = await Admin.findById(verifiedToken.id).select(
            "name email role"
        );
        //save the user into req.obj
        req.userAuth = user;
        next();
    }else{
        const err = new Error("Token expired or invalid");
        next(err);
    }
};

module.exports = isLogin;