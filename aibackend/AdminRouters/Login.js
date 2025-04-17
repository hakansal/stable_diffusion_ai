
const express = require("express");
const route = express.Router();

function generateJWT() {

    const secretKey = process.env.SECRET_KEY;
    return jwt.sign(secretKey, { expiresIn: '1h' });
}

route.post("/giris", async (req, res) => {

  try {
      const { adminame, adminpassword } = req.body;
      //değer kontrolü
      if (!adminame || !adminpassword) return res.status(400).json({ message: "hata değer giriniz" });
      //şifre kontrolü
      if (adminpassword != process.env.ADMIN_PASSWORD) return res.status(400).json({ message: "hata değer giriniz" });
  
      //token üretilip döndürülüyor
      const token = generateJWT();
  
      return res.status(200).json({ message: "Giriş başarılı.", token });
  
  
  } catch (error) {
    return res.status(400).json({ message: "Giriş başarısız.", token });
  }

})
module.exports=route;