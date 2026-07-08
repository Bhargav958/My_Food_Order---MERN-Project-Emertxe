
// We are creating an **error-handling wrapper function** for asynchronous functions.


// To automatically catch errors from `async` functions, so we don't have to write 
// `try...catch` blocks everywhere.


// We use Whenever we create an **async controller function** that may throw errors.

// Example:

// exports.getUser = catchAsyncErrors(async (req, res, next) => {
//   // async code
// });

// If any error occurs inside this async function, it is automatically passed to the 
// global error handler using `next(error)`.

// This wrapper catches errors from async functions and forwards them to Express's 
// error handler automatically, reducing repetitive `try...catch` code.


module.exports = (func) => (req, res, next) =>
  Promise.resolve(func(req, res, next)).catch(next);
