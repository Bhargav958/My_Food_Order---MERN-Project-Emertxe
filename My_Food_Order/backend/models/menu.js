const mongoose = require("mongoose")
const restaurant = require("./restaurant")

const menuSchema = new mongoose.Schema({
    menu:[
        {
            category:{type:String},
            items:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"FoodItem"
                }
            ]
        }
    ],
    restaurant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
})


Menu = mongoose.model("Menu",menuSchema)
module.exports = Menu