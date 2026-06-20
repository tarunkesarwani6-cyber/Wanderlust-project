const Listing = require("../model/listing");
const mongoose = require("mongoose");
const User =
require("../model/user");
const axios =
require("axios");
const ExpressError = require("../utils/ExpressError");
module.exports.homePage =
async (req,res)=>{

   const homes =
   await Listing.find({
      category:"Homes"
   }).limit(5);

   const mountains =
   await Listing.find({
      category:"Mountains"
   }).limit(10);

   const beach =
   await Listing.find({
      category:"Beach"
   }).limit(10);

   const forest =
   await Listing.find({
      category:"Forest"
   }).limit(10);

   const arctic =
   await Listing.find({
      category:"Arctic"
   }).limit(10);

   res.render(
      "listing/home.ejs",
      {
         homes,
         mountains,
         beach,
         forest,
         arctic,
      }
   );

};
module.exports.index = async (req, res) => {
  const listings = await Listing.find({});

  res.render("listing/index.ejs", {
    listings,
    selectedCategory: "Homes",
    currentPage:"listings"
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs", {
    selectedCategory: "",
    currentPage:"new"
  });
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
 
  const url =
req.file.path;

const filename =
req.file.filename;

newListing.image = {
   url,
   filename,
};

  newListing.owner = req.user._id;
  const location =
req.body.listing.location;

const geoResponse =
await axios.get(

`https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`

);

const data =
geoResponse.data[0];

newListing.geometry = {

   lat: parseFloat(data.lat),

   lng: parseFloat(data.lon),

};
  await newListing.save();

  req.flash("success", "New Listing Created!");

  res.redirect("/listings");
};
module.exports.renderWishlist =
async (req,res)=>{

   await req.user.populate(
      "wishlist"
   );

   res.render(
      "listing/wishlist.ejs",
      {
         wishlist:
         req.user.wishlist
      }
   );

};
module.exports.toggleWishlist =
async (req,res)=>{

   const { id } = req.params;

   const user =
   await User.findById(req.user._id);

   const exists =
   user.wishlist.some(
      (item)=>
      item.toString() === id
   );

   if(exists){

      user.wishlist =
      user.wishlist.filter(
         (item)=>
         item.toString() !== id
      );

      req.flash(
         "success",
         "Removed from Wishlist 💔"
      );

   }

   else{

      user.wishlist.push(id);

      req.flash(
         "success",
         "Added to Wishlist ❤️"
      );

   }

   await user.save();

   res.redirect(
      req.headers.referer
   );

};
module.exports.searchListings =
async (req,res)=>{

   let { q } = req.query;

   const listings =
   await Listing.find({

      $or: [

         {
            title: {
               $regex: q,
               $options: "i",
            },
         },

         {
            location: {
               $regex: q,
               $options: "i",
            },
         },

         {
            country: {
               $regex: q,
               $options: "i",
            },
         },

         {
            category: {
               $regex: q,
               $options: "i",
            },
         },

      ],

   });

   res.render(
      "listing/index.ejs",
      {
         listings,
         selectedCategory:"",
         currentPage:"listings"
      }
   );

};
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing Not Found");
  }
  res.render("listing/edit.ejs", {
    listing,
    selectedCategory: listing.category,
    currentPage:"home"
  });
};

module.exports.updateListing =
async (req,res)=>{

   let { id } = req.params;

   let listing =
   await Listing.findByIdAndUpdate(
      id,
      {...req.body.listing}
   );

   if(req.file){

      listing.image = {

         url: req.file.path,

         filename:
         req.file.filename,

      };

      await listing.save();

   }

   req.flash(
      "success",
      "Listing Updated!"
   );

   res.redirect(`/listings/${id}`);

};
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ExpressError(400, "Invalid Listing ID");
  }

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    throw new ExpressError(404, "Listing Not Found");
  }

  res.render("listing/show.ejs", {
    listing,
    selectedCategory: listing.category,
    currentPage:"home"
  });
};
module.exports.categoryListing = async (req, res) => {
  let { category } = req.params;
  const listings = await Listing.find({ category });
  res.render("listing/index.ejs", {
    listings,
    selectedCategory: category,
    currentPage:"home"
  });
};
