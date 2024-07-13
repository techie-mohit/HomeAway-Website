const express= require("express");
const app= express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path= require("path");
const methodOverride= require("method-override")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main()
.then(()=>{
    console.log("mongodb connected")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}


app.get("/",(req,res)=>{
    res.send("working");
})

// INDEX ROUTE
app.get("/listings", async(req,res)=>{
    const alllistings= await Listing.find({});
    res.render("listings/index.ejs", {alllistings});
})

// NEW ROUTE
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs")
})

// ADD NEW ROUTE
app.post("/listings",async(req,res)=>{
    // let{title,description,image,price,location,country}= req.body;
    const newlisting=  new Listing(req.body.listing);
    newlisting.save();
    res.redirect("/listings");
})
// SHOW ROUTE
app.get("/listings/:id", async(req,res)=>{
    let {id}= req.params;
    const listingdetails= await Listing.findById(id);
    res.render("listings/show.ejs", {listingdetails});
})

// EDIT ROUTE
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}= req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs", {listing})
})

// UPDATE ROUTE
app.put("/listings/:id", async(req,res)=>{
    let{id}= req.params;
    const listing= await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");


})

// DELETE ROUTE
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  });
  



// // app.get("/testlisting", async(req, res)=>{
// //     let sampleListing= new Listing({
// //         title: "my new villa",
// //         description: "In the beach",
// //         price: 30000,
// //         location: "Goa ",
// //         country: "India",

// //     });

//     await sampleListing.save();
//     console.log("sample was save");
//     res.send("successful testing");
// });

app.listen(8000, ()=>{
    console.log(`server started at port is 8000`);
})