const express= require("express");
const router= express.Router({mergeParams: true});
const Review = require("../models/review.js");
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor}= require("../middleware.js");

// post review route
router.post("/", 
isLoggedIn,
validateReview, 
    wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newreview= new Review(req.body.review);
    newreview.author= req.user._id;

    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success", "New Review Added");
    res.redirect(`/listings/${listing._id}`);

}));


// delete review route
router.delete("/:reviewId",
   isLoggedIn,
   isReviewAuthor,
   wrapAsync(async(req,res)=>{
    let{id, reviewId}= req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`)
   }) 
)


module.exports= router;