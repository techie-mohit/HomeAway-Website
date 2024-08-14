const Listing = require("../models/listing.js");


// FOR INDEX PAGE
module.exports.index = async(req,res)=>{
    const alllistings= await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
};

// FOR NEW FORM CREATE
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
};

// FOR SHOW LISTINGS
module.exports.showListing = async(req,res)=>{
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
};


// CONNECT NEW FORM TO INDEX PAGE
module.exports.createListing = async(req,res)=>{
    // let{title,description,image,price,location,country}= req.body;
    let url= req.file.path;
    let filename = req.file.filename;
    const newlisting=  new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image= {url, filename};
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};


// CREATE EDIT FORM FOR LISTING
module.exports.renderEditForm = async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing Not Found");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing})
};


// CONNECT OR POST EDITTED FORM TO LISTING
module.exports.updateListing = async(req,res)=>{
    let{id}= req.params;
    const listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated");
    res.redirect("/listings");
};


// DELETE LISTINGS
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};