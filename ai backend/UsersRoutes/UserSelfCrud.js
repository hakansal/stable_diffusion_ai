const express = require("express");
const bcrypt = require("bcrypt");  
const verifyJWT = require("./JWT");
const route = express.Router();
const UserSchema = require("../models/UserModel");

// İsim Güncelleme
route.post("/güncelle/isim", verifyJWT, async (req, res) => {
    try {
        const { username } = req.body;
        const email = req.user.email;

        if (!username) {
            return res.status(422).json({ message: "Hata: Lütfen geçerli bir isim giriniz." });
        }

        await UserSchema.updateOne({ email }, { username });
        return res.status(200).json({ message: "İsim başarıyla güncellendi." });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Şifre Güncelleme
route.post("/güncelle/sifre", verifyJWT, async (req, res) => {
    try {
        const { newpassword } = req.body;
        const email = req.user.email;

        if (!newpassword) {
            return res.status(422).json({ message: "Hata: Lütfen yeni bir şifre giriniz." });
        }

        // Şifreyi şifrele
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        await UserSchema.updateOne({ email }, { password: hashedPassword });
        return res.status(200).json({ message: "Şifre başarıyla güncellendi." });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = route;
