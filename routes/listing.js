const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");
const Listing = require("../model/listing");
const mongoose = require("mongoose");
const listingController = require("../controllers/listings");
const multer =
require("multer");

const {
   storage
} = require("../cloudConfig");

const upload =
multer({ storage });

// VALIDATE LISTING MIDDLEWARE
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const { isLoggedIn } = require("../middleware");
const { isOwner } = require("../middleware");
router.route("/")
.get(wrapAsync(listingController.index))
.post(
   isLoggedIn,upload.single("listing[image]"),
   validateListing,
   wrapAsync(listingController.createListing)
);


// NEW ROUTE
router.get("/new", isLoggedIn,listingController.renderNewForm);
router.get(
   "/search",
   wrapAsync(
      listingController.searchListings
   )
);
router.get(
   "/wishlist",
   isLoggedIn,
   wrapAsync(
      listingController.renderWishlist
   )
);
router.post(
   "/:id/wishlist",
   isLoggedIn,
   wrapAsync(
      listingController.toggleWishlist
   )
);
router.route("/:id")
.get(
   isLoggedIn,
   wrapAsync(listingController.showListing)
)
.put(
   validateListing,upload.single("listing[image]"),
   isLoggedIn,
   isOwner,
   wrapAsync(listingController.updateListing)
)
.delete(
   isLoggedIn,
   isOwner,
   wrapAsync(listingController.deleteListing)
);
// CATEGORY FILTER ROUTE
router.get("/category/:category", wrapAsync(listingController.categoryListing));

// EDIT ROUTE
router.get(
  "/:id/edit",
  isOwner,
  isLoggedIn,
  wrapAsync(listingController.editListing),
);


module.exports = router;
