const express = require("express");
const verifyJWT = require("../JWT");
const { default: axios } = require("axios");
const route = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.memoryStorage();
const upload = multer({ storage });

route.post("/foto/kayit", verifyJWT, upload.single("image"), async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Yetkisiz istek" });

    const { name } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "Dosya eksik!" });

    const dir = `./downloads/${userId}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const safeName = (name || "default").replace(/[^a-z0-9_\-]/gi, "_");
    const filename = safeName + Date.now() + path.extname(file.originalname);
    const filepath = path.join(dir, filename);

    fs.writeFileSync(filepath, file.buffer);

    res.json({ message: "Fotoğraf kaydedildi!", path: filepath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

module.exports = route;
