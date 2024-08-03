const express= require("express");
const router= express.Router();

//INDEX
router.get("/", (req,res)=>{
    res.send("get for users");
})

//SHOW
router.get("/:id", (req,res)=>{
    res.send("get id for users");
})

// POST
router.post("/", (req,res)=>{
    res.send("post for users");
})

// DELETE
router.delete("/:id",(req,res)=>{
    res.send("delete for user id");
})


module.exports=router;