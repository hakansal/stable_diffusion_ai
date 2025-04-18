const express = require("express");
const UserModel = require("../models/UserModel");
const route = express.Router();
const bcrypt = require("bcrypt");
const User_logSchema = require("../models/Userlog");
const SubscriberSchema = require("../models/Subscriber");
const SubsLogSchema = require("../models/Subslog");

route.post("/kayit", async (req, res) => {
    const { email, username, password } = req.body;

    try {
        if (!email || !username || !password) {
            return res.status(410).json({ message: "Lütfen tüm alanları doldurunuz." });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(411).json({ message: "Bu e-posta adresi zaten kayıtlı." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // kullanıcı oluştur
        const newUser = new UserModel({
            email,
            username,
            password: hashedPassword
        });

        await newUser.save();

        // subs oluştur
        const subs = new SubscriberSchema({
            user: newUser._id,
            paycheck: false,
            subs_limit_date: new Date(),
            subs_logs: []
        });
        await subs.save();

        // subs referansı user'a bağla
        newUser.subs = subs._id;

        // sub_log oluştur
        const newsubLog = new SubsLogSchema({
            user: newUser._id,
            pay_log: null
        });
        await newsubLog.save();

        subs.subs_logs.push(newsubLog._id);
        await subs.save();

        // log oluştur
        const logEntry = new User_logSchema({
            user: newUser._id,
            singdate: new Date()
        });
        await logEntry.save();

        newUser.logs.push(logEntry._id);
        await newUser.save();

        return res.status(201).json({ message: "Kullanıcı başarıyla kaydedildi." });

    } catch (error) {
        return res.status(500).json({ error: "Sunucu hatası: " + error.message });
    }
});

module.exports = route;
