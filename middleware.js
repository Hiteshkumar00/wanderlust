const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {reviewSchema, listingSchema} = require("./schema.js");

const ExpressError = require("./utils/ExpressError.js");

//use joi validaton for backend
module.exports.validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(400, error);
  }else{
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body);
  if(error){
    throw new ExpressError(400, error);
  }else{
    next();
  };
};

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  };
  next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let {id} = req.params;
  let oldListing = await Listing.findById(id);
  if(req.user && !oldListing.owner.equals(req.user._id)){
    req.flash("error", "You are not owner of this listing");
    return res.redirect(`/listings/${id}`);
  };
  next();
};

module.exports.isReviewOwner = async (req, res, next) => {
  let {id, r_id} = req.params;
  let review = await Review.findById(r_id);
  if(req.user && !review.owner.equals(req.user._id)){
    req.flash("error", "You are not owner of this Review");
    return res.redirect(`/listings/${id}`);
  };
  next();
};


