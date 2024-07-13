const mongoose = require("mongoose");
const Schema= mongoose.Schema;

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
    }
})

const Listing= mongoose.model("Listing", listingSchema);

module.exports= Listing; 