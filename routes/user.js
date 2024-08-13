const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync= require("../utils/wrapAsync.js");
const passport = require("passport");  // passport provide a authenticate function which is used as route middleware to authenticate requests
const {saveRedirectUrl}= require("../middleware.js");


const userController = require("../controllers/users.js");

// RENDER SIGNUP FORM
router.get("/signup", userController.renderSignupForm);

// SIGNUP 
router.post("/signup", 
wrapAsync(userController.signup));

// RENDER LOGIN FORM
router.get("/login", userController.renderLoginForm);

// LOGIN 
router.post("/login", saveRedirectUrl,
passport.authenticate("local",{ 
failureRedirect: "/login", 
failureFlash: true,
}), userController.login);


// LOGOUT
router.get("/logout", userController.logout);

module.exports=router;
