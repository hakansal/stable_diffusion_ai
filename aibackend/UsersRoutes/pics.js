const express=require("express");
const verifyJWT=require("./JWT");
const { default: axios } = require("axios");
const route=express.Router();


route.post("/foto/kayit",verifyJWT,async(req,res)=>{

    const {url}=req.body;
    if(!url)return res.status(400).send("hata");

   try {
     const response = await axios({
         method: 'GET',
         url: url,
         responseType: 'stream', // Fotoğrafı stream olarak alıyoruz
       });
       const fileName = Date.now() + path.extname(url);
       const filePath = path.join(__dirname, 'downloads', fileName);
   
       // downloads klasörü yoksa oluşturalım
       if (!fs.existsSync(path.join(__dirname, 'downloads'))) {
         fs.mkdirSync(path.join(__dirname, 'downloads'));
       }
       writer.on('finish', () => {
        res.json({ message: 'Fotoğraf kaydedildi!', path: filePath });
      });
  
      writer.on('error', (err) => {
        console.error(err);
        res.status(500).json({ error: 'Dosya kaydedilemedi.' });
      });
   } catch (error) {
     return res.status(400).send(error);

   }
})

module.exports=route;