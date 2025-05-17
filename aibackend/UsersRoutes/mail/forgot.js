const express = require("express");
const sendOneTimeMail = require("./mail");
const route = express.Router();
const Userschema = require("../../models/UserModel");
const bcrypt = require("bcrypt");
require("dotenv").config();
const random8Digit = () => Math.floor(Math.random() * 90000000) + 10000000;
route.post("/forgot", async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "E-posta adresi gerekli." });
    }


    try {

        const user = await Userschema.findOne({ email: email });
        if (!user) {
            res.status(402).json({ message: "hata kullanıcı yok" });
        }
         const new_password=random8Digit().toString(    );
        const hashedPassword = await bcrypt.hash(new_password, 10);
        await Userschema.updateOne({ email: email }, { password: hashedPassword })
        await sendOneTimeMail(
            email,
            ` yeni şifreniz`,
            `
  <div>
    <h2>Geçici Şifreniz</h2>
    <p>Merhaba, şifrenizi sıfırlamak için geçici şifreniz aşağıdadır:</p>
    <p><strong>${new_password}</strong></p>
    <p>Bu şifre ile giriş yaptıktan sonra şifrenizi değiştirmenizi öneririz.</p>
  </div>
`
        );
        res.json({ message: "Mail gönderildi." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Mail gönderilemedi." });
    }


});


module.exports = route;