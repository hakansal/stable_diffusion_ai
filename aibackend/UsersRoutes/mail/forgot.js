const express = require("express");
const sendOneTimeMail = require("./mail");
const route = express.Router();
require("dotenv").config();

route.post("/forgot", async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "E-posta adresi gerekli." });
    }

    try {
        await sendOneTimeMail(
            email,
            ` yeni şifreniz`,
            `
  <div>
    <h2>Geçici Şifreniz</h2>
    <p>Merhaba, şifrenizi sıfırlamak için geçici şifreniz aşağıdadır:</p>
    <p><strong>${ process.env.NEW_PASSWORD}</strong></p>
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