const mongoose = require("mongoose");
const Schema= mongoose.Schema;
const Review= require("./review.js");

const listingSchema= new Schema({
    title: {
        type :String,
        required: true,
    },
    description: {
        type :String,
    },
    image: {
        type :String,
        default: "https://tse3.mm.bing.net/th?id=OIP.-SFha-JzImrEyR_rM5YWhgHaHa&pid=Api&P=0&h=180",
        set : (v) => 
            v==="" 
        ? "https://tse3.mm.bing.net/th?id=OIP.-SFha-JzImrEyR_rM5YWhgHaHa&pid=Api&P=0&h=180" 
        : v,
        
    },
    price: {
        type :Number,
    },
    location: {
        type :String,
    },
    country: {
        type :String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});

    }
})

const Listing= mongoose.model("Listing", listingSchema);

module.exports= Listing; 