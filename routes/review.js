const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema");
const Listing = require("../model/listing");
const mongoose = require("mongoose");
const Review = require("../model/review");
const session = require("express-session");
const {
   isLoggedIn,
   isReviewAuthor
} = require("../middleware");
const reviewController =
require("../controllers/review");





const validateReview = (req,res,next)=>{
   let { error } = reviewSchema.validate(req.body);
   if(error){
      let errMsg = error.details
         .map((el)=>el.message)
         .join(",");
      throw new ExpressError(400, errMsg);
   }else{
      next();
   }
};



// review route
router.post(
  "/",
  validateReview,
  wrapAsync(reviewController.reviewindex)
);


// delete review
router.delete(
   "/:reviewId",isReviewAuthor,isLoggedIn,
   wrapAsync(reviewController.reviewdelete)
);


module.exports = router;