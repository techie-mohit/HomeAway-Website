const Listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{
    const alllistings= await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
};


module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs")
};


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


module.exports.createListing = async(req,res)=>{
    // let{title,description,image,price,location,country}= req.body;
    const newlisting=  new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    await newlisting.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};


module.exports.renderEditForm = async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing Not Found");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing})
};


module.exports.updateListing = async(req,res)=>{
    let{id}= req.params;
    const listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing Updated");
    res.redirect("/listings");
};



module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};