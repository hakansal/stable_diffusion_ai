
const express=require("express");
const verifyJWT = require("./JWT");
const UserModel = require("../models/UserModel");

const route=express.Router();

route.post("/sil",verifyJWT,async(req ,res)=>{

    const {email}=req.body;

    const user=await UserModel.deleteOne({email:email});
    user.save();
});

module.exports=route;