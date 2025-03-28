const express = require("express");
const UserModel = require("../models/UserModel");
const route = express.Router();
const bcrypt = require("bcrypt");
const User_logSchema = require("../models/Userlog");
const SubscriberSchema=require("../models/Subscriber");

route.post("/kayit", async (req, res) => {
    const { email, username, password } = req.body;

    try {
        if (!email || !username || !password) {
            return res.status(400).json({ message: "Lütfen tüm alanları doldurunuz." });
        }

        // Kullanıcı zaten var mı kontrolü
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Bu e-posta adresi zaten kayıtlı." });
        }

        // Şifreyi hashleme
        const hashedPassword = await bcrypt.hash(password, 10);

        // Kullanıcıyı oluşturma
        const newUser = new UserModel({ email, username, password: hashedPassword });
        await newUser.save();
        //kullanıcı subs oluşturma
        const subs=new SubscriberSchema({paycheck:false,subs_limit_date:0,subs_logs:null})
        await subs.save();
        // Kullanıcı giriş logunu oluştur ve kaydet
        const logEntry = new User_logSchema({ singdate: new Date() });
        await logEntry.save();

        // Kullanıcının logs listesine referansı ekle
        newUser.logs.push(logEntry._id);
        await newUser.save();

        return res.status(201).json({ message: "Kullanıcı başarıyla kaydedildi." });
    } catch (error) {
        return res.status(500).json({ error: "Sunucu hatası: " + error.message });
    }
});

module.exports = route;
