//model for reviews collection
const Review = require("../models/review.js");
//model for listings collection
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  req.body.review.owner = req.user._id;
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Successfully Sent!");

  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async (req, res) => {
  let {id, r_id} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews : r_id}});
  await Review.findByIdAndDelete(r_id);
  req.flash("error", "Review Deleted!");
  
  res.redirect(`/listings/${id}`);
};