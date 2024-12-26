const express = require("express");
const router = express.Router();
const passport = require("passport");

//require user controllers
const userController = require("../controllers/users.js");

//defined middleware for catch async function error
const wrapAsync = require("../utils/wrapAsync.js");

// middleware for throw costom error
const ExpressError = require("../utils/ExpressError.js");

//save redirect url for automatic redirect
const { saveRedirectUrl } = require("../middleware.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync( userController.registerUser));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: true
}),userController.loginUser);

router.get("/logout", userController.logoutUser)

module.exports = router;