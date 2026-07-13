const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const APIFeatures = require("../utils/apiFeatures")
const Restaurant = require("../models/restaurant");
const ErrorHandler = require("../utils/errorHandler");

//get all restaurants
exports.getAllRestaurants = catchAsyncErrors(async(req,res,next)=>{
    const apiFeatures = new APIFeatures(Restaurant.find(),req.query).search().sort();

    const restaurants = await apiFeatures.query
    res.status(200).json({
        status:"success",
        count:restaurants.length,
        restaurant: restaurants
    })
})

//get restaurants by ID
exports.getRestaurant = catchAsyncErrors(async(req,res,next)=>{
    const restaurant = await Restaurant.findById(req.params.storeId);
    if(!restaurant){
        return next(new ErrorHandler("Restaurant is not found",404))
    }

    res.status(200).json({
        status:"success",
        data:restaurant
    })
})

//update restaurant
exports.updateRestaurant = catchAsyncErrors(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.storeId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!restaurant) {
    return next(new ErrorHandler("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: restaurant,
  });
});

//create restaurant
exports.createRestaurant = catchAsyncErrors(async (req, res, next) => {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json({
    status: "success",
    data: restaurant,
  });
});

//delete restaurant
exports.deleteRestaurant = catchAsyncErrors(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.storeId);

  if (!restaurant)
    return next(new ErrorHandler("No document found with that ID", 404));

  res.status(204).json({
    status: "success",
  });
});
