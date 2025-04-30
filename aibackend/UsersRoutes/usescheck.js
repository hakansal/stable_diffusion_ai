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

    const subs_pay = subs.paycheck;
    const lastlog = user_log.uses_date;
  if(user_log.uses_date==null){
    const date=new Date();
    await User_logSchema.updateOne({_id:userId},{uses_date:date })
  }
 
    const today = new Date().getDay();
    const lastLoginDay = new Date(lastlog).getDay();

    if (subs_pay === false) {
      // Eğer bugün, son giriş gününden 1 gün sonrasıysa uses sıfırlanır
      if (today - lastLoginDay === 1 || (lastLoginDay === 6 && today === 0)) { 
         
        await UserSchema.updateOne({ _id: userId }, { uses: 0 });
      }

      // Eğer uses hiç yoksa
      if (userinfo.uses == null) {
        await UserSchema.updateOne({ _id: userId }, { uses: 0 });
      }

      // Eğer kullanım hakkı dolmuşsa
      if (userinfo.uses >= 5) {
         
        return res.status(400).json({message:`falsee`});
      } else {
        const respone=await UserSchema.findOne({_id:userId});
        let newuses=respone.uses;
        newuses=newuses+1;
        await UserSchema.updateOne({ _id: userId }, { uses: newuses });
        return res.status(401).json("true");
      }
    } else {
      // Kullanıcı abone ise her zaman true döner
      return res.status(401).json("always true");
    }

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = route;
