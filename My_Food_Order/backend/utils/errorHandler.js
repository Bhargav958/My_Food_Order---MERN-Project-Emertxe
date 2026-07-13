// Short Conclusion for Students

// We are creating a **custom error class** called `ErrorHandler`.

// We write:
// To create errors with both a **message** and an appropriate **HTTP status code**, making error handling more organized and consistent.

// We use:
// Whenever we want to throw a custom error in our application.

// ---

// Example

// return next(new ErrorHandler("Product not found", 404));

// This means:

// Error Message → `"Product not found"`
// Status Code → `404`

// ---

// What does `Error.captureStackTrace()` do?

// It records where the error occurred, helping developers debug the application more easily.

// ---

// >`ErrorHandler` is a custom error class used to create meaningful errors with status codes, making error handling cleaner and more professional.

// >Think of it as a complaint form that contains both the problem description and its severity level, so the support team knows exactly how to respond.

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = (err, req, res, next) => {
    console.error(err);   // Add this

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

module.exports = ErrorHandler;
