const User= require("../models/user.js");

// RENDER SIGNUP FORM
module.exports.renderSignupForm =  (req,res)=>{
    res.render("users/signup.ejs");
};

// SIGNUP
module.exports.signup = async(req,res)=>{
    try{
        let {username, email, password}= req.body;
        const newuser= new User({email, username});
        const registeredUser= await User.register(newuser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "welcoe to wanderlust");
            res.redirect("/listings");
        });

    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// RENDER LOGIN FORM
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

// LOGIN 
module.exports.login = async(req,res)=>{
    req.flash("success", "welcome back to wanderlust");
    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// LOGOUT
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "you are log out");
        res.redirect("/listings");
    })
};