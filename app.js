const express= require("express");
const app= express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path= require("path");


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

app.get("/testlisting", async(req, res)=>{
    let sampleListing= new Listing({
        title: "my new villa",
        description: "In the beach",
        price: 30000,
        location: "Goa ",
        country: "India",

    });

    await sampleListing.save();
    console.log("sample was save");
    res.send("successful testing");
});

app.listen(8000, ()=>{
    console.log(`server started at port is 8000`);
})