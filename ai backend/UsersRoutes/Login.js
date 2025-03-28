const express = require("express");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyJWT = require("./JWT");
const route = express.Router();
const User_logSchema = require("../models/Userlog");

function generateJWT(user) {
    const payload = { username: user.username, email: user.email };
    const secretKey = process.env.SECRET_KEY;
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

// Giriş İşlemi
route.post("/giris", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Lütfen e-posta ve şifre giriniz." });
        }
        //kullanıcı kontrol
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Böyle bir kullanıcı bulunamadı." });
        }
        //şifre kontoll
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Şifre hatalı." });
        }

        const token = generateJWT(user);
        await UserModel.updateOne({ email }, { is_active: true });
        let userLog = await User_logSchema.findOne({ user: user._id });

        if (!userLog) {
             
            userLog = new User_logSchema({ user: user._id, logs: [] });
        }

        //logs'a zaman pushlama
        userLog.logs.push({ date: new Date(), action: "login" });
        await userLog.save();


        return res.status(200).json({ message: "Giriş başarılı.", token });
    } catch (error) {
        return res.status(500).json({ error: "Sunucu hatası: " + error.message });
    }
});

// Çıkış İşlemi
route.get("/cikis", verifyJWT, async (req, res) => {
    try {
        const email = req.user.email;
        await UserModel.updateOne({ email }, { is_active: false });

        return res.status(200).json({ message: "Çıkış başarılı." });
    } catch (error) {
        return res.status(500).json({ error: "Sunucu hatası: " + error.message });
    }
});

module.exports = route;
