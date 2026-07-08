const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    restaurant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    items:[
        {
            foodItem:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"FoodItem"
            },
            quantity:{
                type:Number,
                required:true,
                default:1,
                min: 1
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
}) 

const Cart = mongoose.model("Cart", cartSchema)
module.exports = Cart;