const mongoose= require("mongoose");
const initdata= require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(()=>{
    console.log("mongodb connected")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initdb= async()=>{
    await Listing.deleteMany({}); // first delete all the data if present in database
    await Listing.insertMany(initdata.data); // insert all data from data.js 

    console.log("data was initialized");

}

initdb();

