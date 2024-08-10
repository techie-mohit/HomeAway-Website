const express= require("express");
const app= express();
const mongoose = require("mongoose");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const session= require("express-session");
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user.js");



const listings= require("./routes/listings.js");
const reviews= require("./routes/review.js");
const users= require("./routes/user.js");






main()
.then(()=>{
    console.log("mongodb connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const sessionoption= {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires : Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};

app.get("/",(req,res)=>{
    res.send("THIS IS AN HOME PAGE");
})


app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  // authenticate means user ko login karana ya phir signup karana



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    next();
});

app.get("/demouser", async(req,res)=>{
    let fakeuser= new User({
        email: "student@dmail.com",
        username: "delta"   // username is created because we use passport-local-mongoose middleware
    });

    let registeredUser= await User.register(fakeuser, "helloworld");
    res.send(registeredUser);
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",users);


 

app.all("*", (req,res,next)=>{
    next(new ExpressError(404, "Page Not  Found"));
})

app.use((err,req,res,next)=>{
    let {statuscode=500, message="something went wrong"}= err;
    res.status(statuscode).render("error.ejs", {message})

});

app.listen(8000, ()=>{
    console.log(`server started at port is 8000`);
})