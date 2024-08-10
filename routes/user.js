const express= require("express");
const router= express.Router();
const User= require("../models/user.js");
const wrapAsync= require("../utils/wrapAsync.js");
const passport = require("passport");  // passport provide a authenticate function which is used as route middleware to authenticate requests
router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
});


router.post("/signup", 
wrapAsync(async(req,res)=>{
    try{
        let {username, email, password}= req.body;
        const newuser= new User({email, username});
        const registeredUser= await User.register(newuser, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to wanderlust");
        res.redirect("/listings");

    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login", 
passport.authenticate("local",{ 
failureRedirect: "/login", 
failureFlash: true,
}), 
async(req,res)=>{
    req.flash("success", "welcome back to wanderlust");
    res.redirect("/listings");
})


module.exports=router;
