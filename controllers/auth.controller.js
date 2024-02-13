const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req); // -- this could be null if we haven't flashed  any data before-- like if we first visit signup page

  if (!sessionData) {
    sessionData = {
      // Default data -- if sessionData is null
      email: "",
      confirmEmail: "",
      password: "",
      fullname: "",
      street: "",
      postal: "",
      city: "",
    };
  }

  res.render("customer/auth/signup", { inputData: sessionData }); //-- second parameter -- inputData key name upto us //Render a templates and replaces all dynamic part with finished part
}

async function signup(req, res, next) {
  // Trigerred once the signup form is submitted
  const enteredData = {
    // Used for flashing data on session
    email: req.body.email,
    confirmEmail: req.body["confirm-email"],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };
  //Before signup -- first validate if all the fields entered are valid or not
  // --- VALIDATION LOGIC --- //
  //--We want to flash data when validation failed redirect to signup orr user already existed
  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"]) // Square Breacket is here bcoz in signup ejs form confirmemail field has name confirm-email therefore - we use square brackets
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          "Please check your input. Password must be atleast 6 characters long, postal code must be 6 characters long", // It's our object our key name
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  ); // What are the parameters - We need to extract the value from incoming request

  try {
    //Before signup -- We check for user existence !!
    const existsAlready = await user.existsAlready();

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User exists already! Try logging in instead!",
          ...enteredData,
        },
        function () {
          res.redirect("/signup"); //-- It generates extra request and response cycle

          // render doesnot generate extra requesst cycle
        }
      );
      return;
    }
    await user.signup(); // Returns a promises
  } catch (error) {
    // instead of using default error handling
    next(error); // error to next means default error handler become active in our case rendered 500 template
    return;
  }

  res.redirect("/login"); // Instead of render - bcoz if we render on refresh button - pop up whether you want to sent post data again
} // To handle the submission of form - When user created

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }

  res.render("customer/auth/login", { inputData: sessionData });
}

async function login(req, res) {
  const user = new User(req.body.email, req.body.password);
  let existingUser; // Define it as variable outer block -- hence can be used in inner block
  try {
    existingUser = await user.getUserWithSameEmail(); // try catch could possibly fail for const -- bcoz not available outside the block
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage:
      "Invalid Credentials. Please double check your email and password!",
    email: user.email,
    password: user.password,
  }; // Same required when password is incorrect hence created as a standalone object

  if (!existingUser) {
    // Case when user not existed
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    // Using this cause lost of user entered data
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  ); // existingUser.password -- retrieves password from database

  if (!passwordIsCorrect) {
    // Case password is incorrect
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  //Case Password is correct -- User must logged in -- Manipulates session such that we stored data in it -- this user to which session belongs termed as logged in
  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  // remove some data from the session
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSingup: getSignup, //Pointing to the function
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
