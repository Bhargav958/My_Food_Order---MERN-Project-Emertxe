const mongoose = require("mongoose");

const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI).then((res)=>{
        console.log(`Mongodb connected with HOST${res.connection.host}`);
    })
}

module.exports=connectDatabase