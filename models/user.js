const mongoose = require("mongoose");
const Schema= mongoose.Schema;
const passportlocalmongoose= require("passport-local-mongoose");


const userSchema= new Schema({
    email:{
        type:String,
        required: true,
    },
});

userSchema.plugin(passportlocalmongoose);  // passportlocalmongoose is used because it provide authorization, hash ,salting

module.exports= mongoose.model("User", userSchema);