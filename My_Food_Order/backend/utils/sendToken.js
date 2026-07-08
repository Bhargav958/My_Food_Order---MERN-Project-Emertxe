
// We are creating a `sendToken` utility function.

// To avoid repeating the same code for generating JWT tokens, setting cookies, and sending login/register responses.

// it is used After a user successfully **registers or logs in.

//  What does it do?:
// Generates a JWT token

// const token = user.getJWTToken();

// Stores the token in an HTTP-only cookie


// res.cookie("jwt", token, cookieOptions);


// This makes the token more secure because JavaScript on the browser cannot access it.

// Sets the cookie expiry time


// JWT_EXPIRES_TIME

// So users remain logged in for a specific period.

// Removes the password from the response


// user.password = undefined;
// To prevent sending sensitive information to the client.

// Sends the success response

// res.status(...).json(...)


// ---

// > Think of a movie theater. After verifying your ticket (login), they give you a wristband (JWT token) that lets you enter different areas without checking your identity again.

// ---



// > `sendToken()` generates a JWT token, stores it securely in a cookie, hides sensitive user data, and sends the authentication response to the client.


// Why are we storing the token in a cookie?

// Because HTTP-only cookies are more secure, as they cannot be directly accessed by client-side JavaScript, reducing the risk of XSS attacks.



const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res) => {

  const token = user.createJWTToken();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    data: { user },
  });
};

module.exports = sendToken;