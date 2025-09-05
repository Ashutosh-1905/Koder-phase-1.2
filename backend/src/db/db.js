const { default: mongoose } = require("mongoose");

const connectDB = async (req, res)=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database conneted Successfully.");
    }catch(err){
        console.log("Database connection error : ", err);
        process.exit(1);
    };
};

module.exports = connectDB;