const express= require("express");
const app= express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema , reviewSchema}= require("./schema.js");
const Review = require("./models/review.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
.then(()=>{
    console.log("mongodb connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}


app.get("/",(req,res)=>{
    res.send("THIS IS AN HOME PAGE");
})

// server side validattion npm 
const validateListing= (req,res, next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map((el)=> el.message).join(",");
        console.log(errmsg);
        throw new ExpressError(400, errmsg);
    }
    else{
        next();
    }
};

const validateReview= (req,res, next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map((el)=> el.message).join(",");
        console.log(errmsg);
        throw new ExpressError(400, errmsg);
    }
    else{
        next();
    }
};


// INDEX ROUTE
app.get("/listings",  wrapAsync(async(req,res)=>{
    const alllistings= await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
    })
);

// NEW ROUTE
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs")
})

// ADD NEW ROUTE
app.post("/listings", validateListing, wrapAsync(async(req,res)=>{
    // let{title,description,image,price,location,country}= req.body;
    const newlisting=  new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
   })
);
// SHOW ROUTE
app.get("/listings/:id", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listingdetails= await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", {listingdetails});
    })
);
// EDIT ROUTE
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs", {listing})
    })
);

// UPDATE ROUTE
app.put("/listings/:id",validateListing, wrapAsync(async(req,res)=>{
    let{id}= req.params;
    const listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
   })
);
// DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

//REVIEWS ROUTE 
// post review route
app.post("/listings/:id/reviews",validateReview, 
    wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newreview= new Review(req.body.review);

    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);

}));


// delete review route
app.delete("/listings/:id/reviews/:reviewId",
   wrapAsync(async(req,res)=>{
    let{id, reviewId}= req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`)
   }) 
)


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