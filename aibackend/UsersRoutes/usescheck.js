const express = require("express");
const verifyJWT = require("./JWT");
const UserSchema = require("../models/UserModel");
const User_logSchema = require("../models/Userlog");
const Subscriber = require("../models/Subscriber");
const route = express.Router();

route.get("/kullanim", verifyJWT, async (req, res) => {
  const userId = req.user._id;

  try {
    const userinfo = await UserSchema.findOne({ _id: userId });
    const user_log = await User_logSchema.findOne({ user: userId });
    const subs = await Subscriber.findOne({ user: userId });

    if (!userinfo || !user_log || !subs) {
      return res.status(404).json({ error: "Kullanıcı veya kayıt bulunamadı." });
    }

    let setuses = false;
    const subs_pay = subs.paycheck;
    const lastlog = user_log.uses_date;

    if (!lastlog) {
      const date = new Date();
      // 🔧 DÜZELTİLDİ: Artık `user` üzerinden update yapılıyor
      await User_logSchema.updateOne({ user: userId }, { uses_date: date });
    } else {
      const today = new Date();
      const sameDay =
        today.getFullYear() === lastlog.getFullYear() &&
        today.getMonth() === lastlog.getMonth() &&
        today.getDate() === lastlog.getDate();

      setuses = !sameDay;
    }

    if (!subs_pay) {
      if (setuses) {
        await UserSchema.updateOne({ _id: userId }, { uses: 0 });
        // Güncellenen tarihi tekrar yaz
        await User_logSchema.updateOne({ user: userId }, { uses_date: new Date() });
      }

      if (userinfo.uses == null) {
        await UserSchema.updateOne({ _id: userId }, { uses: 0 });
      }

      if (userinfo.uses == 5) {
        return res.status(400).json({ message: `falsee` });
      } else {
        const updatedUser = await UserSchema.findOne({ _id: userId });
        let newuses = (updatedUser.uses || 0) + 1;

        await UserSchema.updateOne({ _id: userId }, { uses: newuses });
        return res.status(401).json("truee");
      }
    } else {
      return res.status(401).json("always true");
    }

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = route;
