//model for listings collection
const Listing = require("../models/listing.js");

//functon for sort listings to random sequence
const sortRandom = require("../utils/sortRandom.js")


module.exports.index = async (req, res) => {
  let noSort = await Listing.find();
  const allListings = sortRandom(noSort);
  res.render("listings/index.ejs", {allListings});
};


module.exports.renderNewFrom = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.saveNewListing = async (req, res, next) => {
  let {listing} = req.body;
  listing.owner = req.user._id;
  let newListing = new Listing(listing);
  newListing.image = {url: req.file.path, filename: req.file.filename};
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let {id} = req.params;
  //here we can use nested populate for child object populate
  const listing = await Listing.findById(id)
  .populate({
    path: "reviews", populate: {path: "owner"}
  })
  .populate("owner");

  if(!listing){
    req.flash("error", "Listing dose not exist!");
    res.redirect("/listings");
  };
  listing.reviews.reverse();
  res.render("listings/show.ejs", {listing});
};


module.exports.editListingForm = async (req, res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error", "Listing dose not exist!");
    return res.redirect("/listings");
  };
  // let url = listing.image.url;
  // url = url.replace("/upload", "/upload/h_150");
  // listing.image.url = url;
  res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req, res) => {
  let {id} = req.params;
  let {listing} = req.body;
  if(typeof req.file !== "undefined"){
    listing.image = {url: req.file.path, filename: req.file.filename}
  }
  await Listing.findByIdAndUpdate(id, listing);
  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let {id} = req.params;
  await Listing.findByIdAndDelete(id); 
  req.flash("error", "Listing deleted!");
  res.redirect("/listings");
};