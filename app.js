require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./model/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema");
const Review = require("./model/review");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");
const listingController =
require("./controllers/listings");
const userRouter =
   require("./routes/user");

   const multer =
require("multer");

const {
   storage
} = require("./cloudConfig");

const upload =
multer({ storage });


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use(async (req, res, next) => {
  res.locals.success = req.flash("success");

  res.locals.error = req.flash("error");
  if(req.user){

   await req.user.populate(
      "wishlist"
   );

}

res.locals.currUser =
req.user;
  console.log(req.user);

  next();
});



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.listen(8080, (res, req) => {
  console.log("connected to 8080");
});

const MONGOURL = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("db not connected");
  });
async function main() {
  await mongoose.connect(MONGOURL);
}
app.get(
   "/",
   wrapAsync(
      listingController.homePage
   )
);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;

  res.status(statusCode).render("error.ejs", { message });
});

