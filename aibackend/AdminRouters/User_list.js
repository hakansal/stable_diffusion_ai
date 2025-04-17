
const express = require("express");
const verifyJWT = require("./JWT");
const route = express.Router();
const UserModel = require("../models/UserModel");
const SubscriberSchema = require("../models/Subscriber");



route.get("/listele", verifyJWT, async (req, res) => {

    try {
        //kullanıcıları bul ve döndür
        const users = await UserModel.find();
        if (!users) return res.status(400).json({ message: "hata veriler bulunamadı" });
        if(users)return res.status(200).json({ message:users });

        //subscirebe değerlerini bul ve döndür
        const subs=await SubscriberSchema.find();
        if(subs)return res.status(200).json({ message:subs });


    } catch (error) {
        return res.status(400).json({error:error.message});
    }
})

module.exports=route;