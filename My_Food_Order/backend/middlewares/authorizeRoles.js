// We are creating an authorization middleware called authorizeRoles().

// To control which users can access specific routes based on their role
// (Admin, User, Mentor, etc.).

// After a user is logged in and authenticated. Before allowing access,
// we check whether their role is permitted.

// Example
// authorizeRoles("admin")

// This means:

// >Admin can access
// > User cannot access

// authorizeRoles() is used to protect routes by allowing only specific user roles
// to access them after login.

const ErrorHandler = require("../utils/errorHandler");

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403,
        ),
      );
    }

    next();
  };
};
