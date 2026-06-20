const Listing =
require("./model/listing");
const Review =
require("./model/review");


module.exports.isLoggedIn = (req, res, next) => {

   if (!req.isAuthenticated()) {

      req.session.redirectUrl =
         req.originalUrl;

      req.flash(
         "error",
         "You must be logged in first!"
      );

      return res.redirect("/login");

   }

   next();

};
module.exports.saveRedirectUrl =
(req, res, next) => {

   if (req.session.redirectUrl) {

      res.locals.redirectUrl =
         req.session.redirectUrl;

   }

   next();

};
module.exports.isOwner =
async (req, res, next) => {

   let { id } = req.params;

   let listing =
      await Listing.findById(id);

   if (
      !listing.owner.equals(req.user._id)
   ) {

      req.flash(
         "error",
         "You are not the owner!"
      );

      return res.redirect(
         `/listings/${id}`
      );

   }

   next();

};
module.exports.isReviewAuthor =
async (req, res, next) => {

   let { reviewId } = req.params;

   let review =
   await Review.findById(reviewId);

   // anonymous old review
   if (!review.author) {

      return next();

   }

   // normal authorization
   if (
      !review.author.equals(req.user._id)
   ) {

      req.flash(
         "error",
         "You are not review author!"
      );

      return res.redirect(
         `/listings/${req.params.id}`
      );

   }

   next();

};