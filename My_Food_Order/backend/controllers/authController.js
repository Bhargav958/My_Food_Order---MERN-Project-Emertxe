const User = require("../models/user")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middlewares/catchAsyncErrors")
const sendToken = require("../utils/sendToken")
const cloudinary = require("../config/cloudinary")
const Email = require("../utils/email")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const { promisify } = require("util")

//Signup
exports.signup = catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password,passwordConfirm,phoneNumber} = req.body;
    
    let avatar = [];
    //if avatar not provided at registration
    if(!req.body.avatar || req.body.avatar === "/images/images.png"){
        avatar = {
            public_id: "default",
            url: "/images/images.png"
        }
    }else{
        const result = await cloudinary.UploadStream(req.body.avatar,{folder:"avatar", width:150, crop:"scale"})
        avatar={
            public_id : result.public_id,
            url: result.url
        }
    }

    const user = await User.create({name,email,password,passwordConfirm,phoneNumber,avatar})
    sendToken(user,200,res);
})


//login
exports.login = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("please enter the email and password",400));
    }
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    const isPasswordMatch = await user.correctPassword(password, user.password);

    if(!isPasswordMatch){
        return next(new ErrorHandler("Invalid password",401))
    }

    sendToken(user,200,res);
})

//update
// Protect Route
exports.protect = catchAsyncErrors(async (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } 
  else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new ErrorHandler(
        "You are not logged in! Please log in to get access.",
        401
      )
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

if (!currentUser) {
  return next(
    new ErrorHandler(
      "User no longer exists. Please login again.",
      401
    )
  );
}

  if (currentUser.changePasswordAfter(decoded.iat)) {

    return next(
      new ErrorHandler(
        "User recently changed password ! please log in again.",
        404
      )
    );
  }

  req.user = currentUser;

  next();
});


// Get profile
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });

});


// Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

  const { oldPassword, newPassword, newPasswordConfirm } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  const isMatched = await user.correctPassword(oldPassword, user.password);

  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });

});


// Update Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {

    const user = await User.findById(req.user.id);

    const image_id = user.avatar.public_id;

    await cloudinary.uploader.destroy(image_id);

    const result = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
  });

});


// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("There is no user with email address .", 404));
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  try {

    const resetURL = `${process.env.FRONTEND_URL}/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });

  } catch (err) {

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorHandler(
        "There was an error sending the email, try again later!",
        500
      )
    );
  }

});


// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({

    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },

  });

  if (!user) {
    return next(new ErrorHandler("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  sendToken(user, 200, res);

});


// Logout
exports.logout = catchAsyncErrors(async (req, res, next) => {

  res.cookie("jwt", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });

});
