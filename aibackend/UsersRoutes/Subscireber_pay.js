
const express = require("express");
const verifyJWT = require("./JWT");
const route = express.Router();
const SubscriberSchema = require("../models/Subscriber");
const UserSchema = require("../models/UserModel");
const axios = require("axios");


// Kullanıcının Patreon'a yönlendirileceği URL
route.get('/patreon/giris', verifyJWT, (req, res) => {
    const clientId = process.env.CLIENT_ID;
    const redirectUri = process.env.PATREON_REDIRECT_URI;
    const scope = 'identity identity.memberships';

    const authUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    res.redirect(authUrl);
});

route.get('/patreon/callback', async (req, res) => {
    const code = req.query.code;
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.PATREON_REDIRECT_URI;

    try {
        // Patreon'dan Access Token al
        const tokenRes = await axios.post('https://www.patreon.com/api/oauth2/token', null, {
            params: {
                code,
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
            },
        });

        const accessToken = tokenRes.data.access_token;

        // Kullanıcı bilgilerini al
        const identityRes = await axios.get('https://www.patreon.com/api/oauth2/v2/identity', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                'fields[user]': 'email,full_name',
            },
        });



        // Membership bilgisi kontrolü
        const memberships = identityRes.data.relationships ? identityRes.data.relationships.memberships : null;

        if (!memberships || memberships.length === 0) {

            return res.status(400).send(`<script>
              window.opener.postMessage('faild', '*');
                window.close();
                </script>`);
        }
        // üyelik artırma
        if (memberships ) {

            return res.status(400).send(`<script>
          window.opener.postMessage('succsess', '*');
            window.close();
            </script>`);
        }

        // Üye bilgilerini al
        const memberData = memberships.find(item => item.type === 'member');
        if (!memberData) {
            console.log("Member bilgisi bulunamadı.");
            return res.status(400).send("Üyelik bilgisi alınamadı.");
        }

        const memberId = memberData.id;
        if (!memberId) {
            console.error("Membership ID bulunamadı 😢");
            return res.status(400).send("Üyelik ID'si bulunamadı.");
        }



        // Üyelik detaylarını al
        const membershipDetails = await axios.get(`https://www.patreon.com/api/oauth2/v2/members/${memberId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                include: 'currently_entitled_tiers,campaign',
                'fields[member]': 'patron_status,currently_entitled_tiers,campaign',
                'fields[tier]': 'title,amount_cents',
                'fields[campaign]': 'name',
            },
        });

        // Kullanıcı ve üyelik detaylarını konsola yazdır
        const userData = identityRes.data;
        const membershipData = membershipDetails.data;


        // Kullanıcıyı başarılı bir şekilde yönlendirme
        res.send('Patreon hesabınızla giriş başarılı!');

    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send('Patreon bağlantı hatası');
    }
});



route.get("/abonelik", verifyJWT, async (req, res) => {
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
    const user = req.user;
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