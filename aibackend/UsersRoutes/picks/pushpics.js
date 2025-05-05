const express=require("express");
const verifyJWT = require("../JWT");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const route=express.Router();


const storage=multer.memoryStorage();
const send= multer({storage});

route.post("/send/pics",verifyJWT,async(req ,res)=>{
    const userId = req.user._id;
 try {
    
       const dir = `./downloads/${userId}`;
       if (!fs.existsSync(dir)) return res.status(404).json({ error: "Fotoğraf klasörü bulunamadı" });
   
       const files = fs.readdirSync(dir);
       const imageUrls = files.map(file => ({
         filename: file,
         url: `/foto/indir/${userId}/${file}`
       }));
       res.json({ images: imageUrls });
 } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
 }

});
 
 


module.exports=route;