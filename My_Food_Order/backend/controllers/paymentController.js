const catchAsyncErrors = require("../middlewares/catchAsyncErrors")

const dotenv = require("dotenv")
dotenv.config({path:"./config/config.env"});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
console.log("KEY ",process.env.STRIPE_SECRET_KEY)

exports.processPayment = catchAsyncErrors(async(req,res,next)=>{
    const items = req.body.items || [];

    //create stripe checkout session
    const session = await stripe.checkout.sessions.create({
        customer_email: req.user.email,
        phone_number_collection: {enabled:true},
        line_items: items.map((item)=>({
            price_data: {
                currency: "inr",
                product_data:{
                    name: item.foodItem?.name || item.fooditem?.name,
                    images:[item.foodItem?.images?.[0]?.url || item.fooditem?.images?.[0]?.url || `${process.env.FRONTEND_URL}/images/template.jpeg`],
                },
                unit_amount: (item.foodItem?.price || item.fooditem?.price) * 100
            },
            quantity: item.quantity
        })),
        mode: "payment",
        shipping_address_collection:{
            allowed_countries:["US","IN"]
        },
        shipping_options:[
            {
                shipping_rate_data: {
                    display_name:"Delivery Charges",
                    type:"fixed_amount",
                    fixed_amount:{
                        amount:5500,
                        currency:"inr"
                    },
                    delivery_estimate:{
                        minimum:{
                            unit:"hour",
                            value:1     
                        },
                        maximum:{
                            unit:"hour",
                            value:3  
                        }
                    }
                }
            }
        ],
        success_url:`${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:`${process.env.FRONTEND_URL}/cart`
    });
    res.status(200).json({url:session.url})
})

exports.sendStripeApi = catchAsyncErrors(async(req,res,next)=>{
    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })
})
