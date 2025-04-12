const mongoose=require("mongoose");

const Subs_logSchema= new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    pay_log:{
        type:String,

    }
})
module.exports=mongoose.model("Subs_log",Subs_logSchema);