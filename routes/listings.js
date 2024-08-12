const express= require("express");
const router= express.Router();
const Listing = require("../models/listing.js");
const wrapAsync= require("../utils/wrapAsync.js");
const {listingSchema}= require("../schema.js");
const ExpressError= require("../utils/ExpressError.js");
const {isLoggedIn , isOwner, validateListing}= require("../middleware.js");

const listingController = require("../controllers/listing.js");



// INDEX ROUTE
router.get("/",  wrapAsync(listingController.index));

// NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ADD NEW ROUTE
router.post("/", validateListing, wrapAsync(listingController.createListing));


// SHOW ROUTE
router.get("/:id", wrapAsync(listingController.showListing));


// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner,  wrapAsync(listingController.renderEditForm));

// UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));
// DELETE ROUTE

router.delete("/:id",isLoggedIn, isOwner,  wrapAsync(listingController.deleteListing));


module.exports=router;