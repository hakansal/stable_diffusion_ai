const mongoose=require("mongoose");


const User_logSchema= new mongoose.Schema({

    
    singdate:{
        type:Date
    },
    whenlogindate:[{
        type:Date
    }]
});

module.exports=mongoose.model("User_log",User_logSchema)