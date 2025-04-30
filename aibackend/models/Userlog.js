const mongoose=require("mongoose");


const User_logSchema= new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    uses_date:{
        type:Date,
      
    },
    singdate:{
        type:Date
    },
    whenlogindate:[{
        type:Date
    }]
});

module.exports=mongoose.model("User_log",User_logSchema)