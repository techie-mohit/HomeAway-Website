const express= require("express");
const router= express.Router();
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}= require("./schema.js");
const Listing= require("./models/listing");
const Review= require("./models/review");



module.exports.isLoggedIn = (req,res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "you must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl= (req,res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner= async(req,res,next)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash("error", "Only owner can have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


// server side validattion npm 
module.exports.validateListing= (req,res, next)=>{
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


module.exports.validateReview= (req,res, next)=>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errmsg= error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400, errmsg);
    }
    else{
        next();
    }
};


module.exports.isReviewAuthor= async(req,res,next)=>{
    let {id,reviewId}= req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curruser._id)){
        req.flash("error", "you are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


