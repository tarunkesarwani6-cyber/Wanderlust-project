const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let listschema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
    filename: String,
    url: String,
  },

  price: Number,
  location: String,
  country: String,
  category:{
    type:String,
},
reviews:[
   {
      type: Schema.Types.ObjectId,
      ref:"Review",
   }
],
owner: {
   type: Schema.Types.ObjectId,
   ref: "User",
},
geometry: {
   lat: Number,
   lng: Number,
},
});

let Listing = mongoose.model("Listing", listschema);

module.exports = Listing;