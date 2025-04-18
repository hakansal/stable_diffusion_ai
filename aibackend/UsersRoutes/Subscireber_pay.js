
const express = require("express");
const verifyJWT = require("./JWT");
const route = express.Router();
const SubscriberSchema = require("../models/Subscriber");
const UserSchema = require("../models/UserModel");

// Kullanıcının Patreon'a yönlendirileceği URL
app.get('/auth/patreon', (req, res) => {
    const clientId = process.env.PATREON_CLIENT_ID;
    const redirectUri = process.env.PATREON_REDIRECT_URI;
    const scope = 'identity identity.memberships';
  
    const authUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    res.redirect(authUrl);
  });
  

route.get("/abonelik/odeme", verifyJWT, async (req, res) => {
    const userId = req.user._id;
    const user = req.user;
    //kullanıcı kontroll
    try {
        if (!user || !userId) return res.status(400).json({ message: "hata kullanıcı" });

        //subs model update
        let date = new Date();
        date.setMonth(date.getMonth() + 1);
        const subs = await SubscriberSchema.updateOne({ user: user._id }, { paycheck: true, subs_limit_date: date });

        return res.status(200).json({ message: "ödeme tamamlandı" });
    } catch (error) {
        return res.status(400).json({ error: error.message });

    }

})
route.get("/abonelik", verifyJWT, async (req, res) => {
    const userId = req.user._id;
    const  user  = req.user;
    try {
        if (!user) return res.status(400).json({ message: "hata kullanıcı" });
        const date = new Date();
        const subs = await SubscriberSchema.findOne({ user: userId });
        if (date > subs.subs_limit_date) {
            await SubscriberSchema.updateOne({ user: userId }, { paycheck: false });
            subs.save();
            return res.status(400).json({ message: " kullanıcı süresi geçmiş" });
        }
        return res.status(200).json({ message: "abonelik hala devam ediyor" });

    } catch (error) {
        return res.status(400).json({ error: error.message });

    }
})

module.exports = route;