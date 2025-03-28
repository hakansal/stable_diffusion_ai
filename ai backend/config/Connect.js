const mongoose=require("mongoose");
require("dotenv").config();
const Connect=async()=>{
try {
    
        await mongoose.connect(process.env.DB_URL);
        console.log("database bağlandı");
} catch (error) {
    console.log(error)
}
}

module.exports=Connect;