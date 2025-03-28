const express = require("express");
const verifyJWT = require("./JWT");
const route = express.Router();
const UserSchema = require("../models/UserModel");
const SubscriberSchema = require("../models/Subscriber");

route.get("/kullanici", verifyJWT, async (req, res) => {
    try {
        const user = req.user;  

        if (!user || !user._id) {
            return res.status(400).json({ message: "hata kullanıcı bulunamadı" });
        }

        // Kullanıcı bilgilerini içeren nesne
        let response = {
            email: user.email,
            username: user.username,
            logs: user.logs
        };

        // Abonelik bilgilerini kontrol et ve ekle
        const subs = await SubscriberSchema.findOne({ user: user._id });
        if (subs) {
            response.paycheck = subs.paycheck;
            response.subs_limit_date = subs.subs_limit_date;
            response.subs_log = subs.subs_log;
        }

        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({ error: error.message }); // 500 hata kodu kullanıldı
    }
});

module.exports = route;
