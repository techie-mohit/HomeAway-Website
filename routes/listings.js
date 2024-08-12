const express= require("express");
const router= express.Router();
const Listing = require("../models/listing.js");
const wrapAsync= require("../utils/wrapAsync.js");
const {listingSchema}= require("../schema.js");
const ExpressError= require("../utils/ExpressError.js");
const {isLoggedIn , isOwner, validateListing}= require("../middleware.js");



// INDEX ROUTE
router.get("/",  wrapAsync(async(req,res)=>{
    const alllistings= await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
    })
);

// NEW ROUTE
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs")
})

// ADD NEW ROUTE
router.post("/", validateListing, wrapAsync(async(req,res)=>{
    // let{title,description,image,price,location,country}= req.body;
    const newlisting=  new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
   })
);
// SHOW ROUTE
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listingdetails= await Listing.findById(id)
    .populate({
        path:"reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listingdetails){
        req.flash("error", "Listing Not Found");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listingdetails});
    })
);
// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner,  wrapAsync(async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing Not Found");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing})
    })
);

// UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async(req,res)=>{
    let{id}= req.params;
    const listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated");
    res.redirect("/listings");
   })
);
// DELETE ROUTE
router.delete("/:id",isLoggedIn, isOwner,  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);


module.exports=router;