const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    is_active:{
        type:Boolean,

    },
    logs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User_log"
    }],
    subs:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subs"
    }]
})

module.exports=mongoose.model("User",UserSchema);