const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please enter foodItem name"],
        trim: true,
        maxLength:[100, "FoodItem name cannot more than 100"]
    },
    price:{
        type:Number,
        required:[true,"please enter price"],
        maxLength:[5,"FoodItem price cannot more than 5"],
        default:0.0
    },
    description:{
        type:String,
        required:[true,"please enter desc"], 
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    menu: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Menu"
    },
    stock:{
        type:Number,
        required:[true,"Please enter foodItem stock"],
        maxLength:[5, "foodItems stock cannot be more than 5"],
        default:0,
    },
    restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Restaurant"           
    },
    numOfReviews:{
        type:Number,
        default:0
    },
        reviews: [
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true,
            },
            Comment:{
                 type:String,
                 required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("FoodItem",foodSchema)
//fooditems