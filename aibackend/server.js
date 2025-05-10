const express = require("express");
const Connect = require("./config/Connect");
const app = express();
const cors = require("cors");
const path = require("path");

// Middleware
app.use(express.json());
app.use(cors());

// Statik dosyalar
app.use("/foto/indir", express.static(path.join(__dirname, "downloads")));

// Veritabanı bağlantısı
Connect();

// User route'ları
const SignUser = require("./UsersRoutes/sign");
const LoginUser = require("./UsersRoutes/Login");
const UpdateUser = require("./UsersRoutes/UserSelfCrud");
const User_info = require("./UsersRoutes/Userİnfo");
const Subscireber_pay = require("./UsersRoutes/Subscireber_pay");
const Uses = require("./UsersRoutes/usescheck");
const Pullpicks = require("./UsersRoutes/picks/pullpicks");
const Pushpicks = require("./UsersRoutes/picks/pushpics");
const Forgot=require("./UsersRoutes/mail/forgot");

app.use("/userapp", SignUser);
app.use("/userapp", LoginUser);
app.use("/userapp", UpdateUser);
app.use("/userapp", User_info);
app.use("/userapp", Subscireber_pay);
app.use("/userapp", Uses);
app.use("/userapp", Pullpicks);
app.use("/userapp", Pushpicks);
app.use("/userapp",Forgot)

// Admin route'ları
const LoginAdmin = require("./AdminRouters/Login");
const AdminCrud = require("./AdminRouters/AdminCrud");
const Admin_user_list = require("./AdminRouters/User_list");

app.use("/adminapp", LoginAdmin);
app.use("/adminapp", AdminCrud);
app.use("/adminapp", Admin_user_list);

// Sunucu başlatma
app.listen(process.env.SERVER_PORT_TEST, () => {
    console.log("server başladı");
});
