const express=require("express");
const Connect =require("./config/Connect");
const app=express();
const cors=require("cors")
//user route'ları
const SignUser=require("./UsersRoutes/sign");
const LoginUser=require("./UsersRoutes/Login");
const UpdateUser=require("./UsersRoutes/UserSelfCrud");
const User_info=require("./UsersRoutes/Userİnfo");
const Subscireber_pay=require("./UsersRoutes/Subscireber_pay");
const Uses=require("./UsersRoutes/usescheck");
const Pullpicks=require("./UsersRoutes/picks/pullpicks");
const Pushpicks=require("./UsersRoutes/picks/pushpics");

//admin route'ları
const LoginAdmin=require("./AdminRouters/Login");
const AdminCrud=require("./AdminRouters/AdminCrud");
const Admin_user_list=require("./AdminRouters/User_list");
app.use(express.json());
Connect();
app.use(cors());

//users
app.use("/userapp",SignUser);
app.use("/userapp",LoginUser);
app.use("/userapp",UpdateUser);
app.use("/userapp",User_info);
app.use("/userapp",Subscireber_pay);
app.use("/userapp",Uses)
app.use("/userapp",Pullpicks)
app.use("/userapp",Pushpicks)




//admins
app.use("/adminapp",LoginAdmin);
app.use("/adminapp",AdminCrud);
app.use("/adminapp",Admin_user_list);


 

app.listen(process.env.SERVER_PORT_TEST,()=>{
    console.log("server başladı");
})