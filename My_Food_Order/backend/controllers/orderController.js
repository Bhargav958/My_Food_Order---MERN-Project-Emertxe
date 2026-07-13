const Order = require("../models/order");
const Cart = require("../models/cartModel");
const { ObjectId } = require("mongodb");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const dotenv = require("dotenv");

//setting up config file
dotenv.config({ path: "./config/config.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create a new order   =>  /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  console.log("BODY =", req.body);

  const { session_id, items = [], restaurant } = req.body;
  console.log("session_id =", session_id);

  const session = await stripe.checkout.sessions.retrieve(session_id,{
      expand:["customer"],
  });

  console.log("SESSION FOUND");

  console.log(session);

  console.log("shipping_cost =", session.shipping_cost);

  let cart = await Cart.findOne({
      user:req.user._id
  })
  .populate({
      path:"items.foodItem",
      select:"name price images"
  })
  .populate({
      path:"restaurant",
      select:"name"
  });

  console.log("CART =", cart);

  console.log("Reached before Order.create()");

  const cartItems = cart?.items?.length
    ? cart.items.map((item) => ({
        fooditem: item.foodItem,
        quantity: item.quantity,
      }))
    : items;

  if (!cartItems.length) {
    return next(new ErrorHandler("No order items found", 400));
  }

  let deliveryInfo = {
    address:
      session.shipping_details?.address?.line1 ||
      req.user.address ||
      "Address provided through Stripe",
    city: session.shipping_details?.address?.city || "Not provided",
    phoneNo: session.customer_details?.phone || req.user.phoneNumber,
    postalCode: session.shipping_details?.address?.postal_code || "000000",
    country: session.shipping_details?.address?.country || "IN",
  };
  let orderItems = cartItems.map((item) => {
    const fooditem = item.fooditem || item.foodItem;
    return {
    name: fooditem.name,
    quantity: item.quantity,
    image: fooditem.images?.[0]?.url || "/images/template.jpeg",
    price: fooditem.price,
    fooditem: fooditem._id,
  }});

  let paymentInfo = {
    id: session.payment_intent,
    status: session.payment_status,
  };

  const order = await Order.create({
    orderItems,
    deliveryInfo,
    paymentInfo,
    deliveryCharge: session.shipping_cost ? session.shipping_cost.amount_subtotal / 100 : 0,
    itemsPrice: +session.amount_subtotal / 100,
    finalTotal: +session.amount_total / 100,
    user: req.user.id,
    restaurant: cart?.restaurant?._id || restaurant,
    paidAt: Date.now(),
  });
  console.log("Order created successfully");
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(200).json({
    success: true,
    order,
  });
  
});

// Get single order   =>   /api/v1/orders/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged in user orders   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  // Get the user ID from req.user
  const userId = new ObjectId(req.user.id);
  // Find orders for the specific user using the retrieved user ID
  const orders = await Order.find({ user: userId })
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders - ADMIN  =>   /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.finalTotal;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});
