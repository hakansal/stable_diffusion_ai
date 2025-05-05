const express=require("express");
const verifyJWT = require("../JWT");
const multer = require("multer");
const route=express.Router();


const storage=multer.memoryStorage();
const send= multer({storage});

route.post("/send/pics",verifyJWT,async(req ,res)=>{
 

});


module.exports=route;