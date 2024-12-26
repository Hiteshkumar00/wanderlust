//require users model
const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.registerUser = async (req, res) => {
  try{
    let {username, email, password} = req.body.user;
    let newUser = new User({username, email});
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err)=> {
      if(err){
        return next(err);
      };
      req.flash("success", `"${username}", Welcome to WanderLust!`);
      res.redirect("/listings")
    });
  }catch(err){
    req.flash("error", err.message);
    res.redirect("/signup");
  }  
};

module.exports.renderLoginForm = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success","Welcome back to WanderLust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res)=> {
  // req.logout have one call back after logout we we want to do;
  req.logOut((err) => {
    if(err){
      return next(err);
    };
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
}