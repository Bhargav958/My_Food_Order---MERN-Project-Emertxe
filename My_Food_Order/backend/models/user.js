const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")



// Create Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter valid name"],
        maxLen: [30, "name cannot be empty"]
    },
    email:{
        type: String,
        required: [true,"please enter valid email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "enter valid email"]
    },
    password:{
        type: String,
        required: [true,"enter password"],
        minLen: 8,
        select: false
    },
    passwordConfirm:{
        type: String,
        required: [true, "confirm password"],
        validate:{
            validator: function(e){return e===this.password},
            message: "password is not same"
        },
    },
    phoneNumber:{
        type: String,
        required: true,
        match : [/^[0-9]{10}$/, "enter valid number"]
    },
    role:{
        type: String,
        enum:["user","admin"],
        default: "user"
    },
    avatar:{
        public_id: String,
        url: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
},
{timestamps:true}
)

userSchema.pre("save", async function(){
    if(!this.isModified("password"))return;
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
})

//password compare at login time
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword,userPassword);
}


//Whether changes the password after getting jwt token
//if yes old tiken is invalid and user must log in again.
userSchema.methods.changePasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

//custom method to generate jwt token.
userSchema.methods.createJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES})
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model("User", userSchema) 
