const express = require("express");
const verifyJWT = require("./JWT");
const route = express.Router();
const UserSchema = require("../models/UserModel");
const SubscriberSchema = require("../models/Subscriber");
const User_logSchema =require("../models/Userlog");

route.get("/kullanici", verifyJWT, async (req, res) => {
    const userId = req.user._id;
    const user = req.user;  
    try {
         

        if (!user ) {
            return res.status(400).json({ message: "hata kullanıcı bulunamadı" });
        }
        const usern=await UserSchema.findOne({email:user.email})
        // Kullanıcı bilgilerini içeren nesne
        let response = {
            email: user.email,
            username: usern.username,
            uses:usern.uses,
            paycheck:null,
            subs_limit_date:null,
            subs_log:null,
            sign_date:null,
            allLogindates:null
        };

        // Abonelik bilgilerini kontrol et ve ekle
        const subs = await SubscriberSchema.findOne({ user:userId });
        if (subs) {
            response.paycheck = subs.paycheck;
            response.subs_limit_date = subs.subs_limit_date;
            response.subs_log = subs.subs_log;
        }
        //user log bilgilerini ekle
        const user_logs=await User_logSchema.findOne({user:userId })
        if(user_logs){
            response.sign_date=user_logs.singdate;
            response.allLogindates=user_logs.whenlogindate;
        }
        const newrespone=response

        return res.status(200).json(newrespone);

    } catch (error) {
        return res.status(500).json({ error: error.message }); // 500 hata kodu kullanıldı
    }
});

module.exports = route;
