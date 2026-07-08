// We are creating a Global Error Handling Middleware in Express.

// We write:
// To handle all application errors in one place and send meaningful error messages to the client.

// We use:
// Whenever any error occurs in the application and next(error) is called.

// It handle:
// Invalid MongoDB Object IDs
// Mongoose Validation Errors
// Duplicate Key Errors (e.g., same email registered twice)
// Invalid JWT Tokens
// Expired JWT Tokens
// Unexpected Server Errors

// Development vs Production
// Development: Shows detailed error information (message + stack trace) to help developers debug.
// Production: Shows only user-friendly messages without exposing sensitive details.

// This middleware acts as the central error manager of the application, catching all errors and sending appropriate responses based on the environment. 

// Think of it as the hospital's emergency department — no matter what type of emergency comes in, it decides how to handle it and what information should be shared with the patient.


const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  // if statusCode does not exist then 500 will be taken as error code ->internal server error
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };
    error.message = err.message;

    // Wrong Mongoose Object Id Error . if we type wrong product id in route we will get error.
    if (err.name == "castError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Handling Mongoose Validation Error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    // Handling Mongoose duplicate key errors
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new ErrorHandler(message, 400);
    }

    // Handling wrong JWT error
    if (err.name === "JsonWebTokenError") {
      const message = "JSON Web Token is invalid. Try Again!!!";
      error = new ErrorHandler(message, 400);
    }

    // Handling Expired JWT error
    if (err.name === "TokenExpiredError") {
      const message = "JSON Web Token is expired. Try Again!!!";
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
