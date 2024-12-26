if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path"); 

//session and mongo_store and flash
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

//for server side error handling
const ExpressError = require("./utils/ExpressError.js");

//passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//use ejs as view engine
app.set("view engine", "ejs");

//ejs-mate templeting improve
const ejsMate = require("ejs-mate");
app.engine('ejs', ejsMate);


//method override
const methodOverride = require("method-override");
app.use(methodOverride('_method'));


//connect to database
const MONGO_URL = process.env.ATLASDB_URL;
main()
.then(res => console.log("Connected to DB."))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
};

//set file path to dinamic
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

//req body data in urlencoded to say express
app.use(express.urlencoded({extended: true}));

//create mongo online session store
const store =  MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET, 
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error in MONGO SESSION STORE");
});

//use session falash
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false, 
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + (7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};


app.use(session(sessionOption));
app.use(flash());

//use passport related things
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//we access this all infomation in pages.
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//root route
app.get("/", (req, res) => {
  res.redirect("/listings");
});

//all listings route using router
const listingRouter = require("./routes/listing.js");
app.use("/listings", listingRouter);

//all reviews route using router
const reviewRouter = require("./routes/review.js");
app.use("/listings/:id/reviews", reviewRouter);

//all users route using router
const userRouter = require("./routes/user.js");
app.use("/", userRouter);

//error handling routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  console.log(err);
  let {status = 500, message = "Something Went Wrong!"} = err;
  res.status(status).render("error.ejs",{ message });
});

app.listen(port, ()=>{
  console.log(`Server is listining to port ${port}.`);
});