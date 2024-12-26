const express = require("express");
const router = express.Router({mergeParams: true});

//for check is logged in or not by our defined middleware
const {isLoggedIn, validateReview, isReviewOwner} = require("../middleware.js");

//require all controllers
const reviewController = require("../controllers/reviews.js");


//defined middleware for catch async function error
const wrapAsync = require("../utils/wrapAsync.js");




//listing review add 
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//review destroy
router.delete("/:r_id", isLoggedIn, isReviewOwner,wrapAsync(reviewController.destroyReview));


module.exports = router;