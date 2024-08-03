const express= require("express");
const app= express();
const users= require("./routes/user.js");
const posts= require("./routes/post.js");
const session= require("express-session");
const path= require("path");
const flash= require("connect-flash");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// app.get("/getcookies", (req,res)=>{
//     res.cookie("greet", "namaste");
//     res.cookie("orgin","India");
//     res.send("we sent you a cookies");
// });


// app.get("/", (req,res)=>{
//     res.send("hi i am root");
// });

// app.use("/users", users);
// app.use("/posts", posts);


// app.use(session({secret: "mysupersecret", resave:false,
// saveUninitialized : true,
// }));

app.get("/reqcount", (req,res)=>{
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count=1;
    }
    res.send(`you request the session ${req.session.count} times`);
})


app.get("/test",(req,res)=>{
    res.send("test successful");
});

const sessionoption= {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionoption));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successmsg= req.flash("success");
    res.locals.errormsg= req.flash("error");
    next();
})

app.get("/register", (req,res)=>{
    let {name ="anonymous"}= req.query;
    // console.log(req.session);
    req.session.name = name; 
    // console.log(req.session.name);
    // res.send(name);
    // res.send(name);
    // res.redirect("/hello");
    if(name=="anonymous"){
        req.flash("error", "user not registered");
    }
    else{
        req.flash("success", "user  registered successfully");


    }
    res.redirect("/hello");

});

app.get("/hello", (req,res)=>{
    
    res.render("page.ejs",{name: req.session.name});
});

app.listen(3000, ()=>{
    console.log(`server is listening`);
})
