const express = require("express");
const router = express.Router();

//for check is logged in or not by our defined middleware and isOwner or not
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//require all controllers
const listingController = require("../controllers/listings.js");

//defined middleware for catch async function error
const wrapAsync = require("../utils/wrapAsync.js");

//cloudinary config data
const {storage} = require("../cloudConfig.js");

//multer for multipart form data
const multer  = require('multer');
const upload = multer({ storage });


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.saveNewListing));

//new listing form
router.get("/new", isLoggedIn, listingController.renderNewFrom);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,  isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListingForm));


module.exports = router;