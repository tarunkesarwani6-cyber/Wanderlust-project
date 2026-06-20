const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync");
const passport = require("passport");
const User = require("../model/user");
const {
   saveRedirectUrl
} = require("../middleware");
const userController =
   require("../controllers/user");

const { isLoggedIn } = require("../middleware");

//signup route
router.get("/signup", userController.signup
);

router.post("/signup",
   wrapAsync(userController.signuppost));



// login route 
router.get("/login", (req, res) => {
   res.render("user/login.ejs");
});


router.post("/login",
   saveRedirectUrl,
   passport.authenticate(
      "local",
      {
         failureRedirect: "/login",
         failureFlash: true,
      }
   ), userController.login);


// logout
router.get("/logout", userController.logout);


router.get(
   "/forgot-password",isLoggedIn,
   userController.renderForgot
);

router.post(
   "/forgot-password",
   wrapAsync(userController.forgotPassword)
);

router.get(
   "/reset/:token",isLoggedIn,
   userController.renderReset
);

router.post(
   "/reset/:token",
   wrapAsync(userController.resetPassword)
);
router.get(
   "/profile",isLoggedIn,
   (req,res)=>{

      res.render(
         "user/profile.ejs"
      );

   }
);
module.exports = router;