const Listing = require("../model/listing");
const User =
   require("../model/user");
const crypto =
   require("crypto");
const nodemailer =
   require("nodemailer");

const transporter =
   nodemailer.createTransport({

      service: "gmail",

      auth: {

         user: process.env.EMAIL,

         pass: process.env.EMAIL_PASS,

      },

   });
module.exports.signup = (req, res) => {
   res.render("user/signup.ejs")
};
module.exports.signuppost = async (req, res, next) => {

   try {

      let { username, email, password }
         = req.body;

      const newUser = new User({
         email,
         username
      });

      const registeredUser =
         await User.register(
            newUser,
            password
         );

      req.login(registeredUser, (err) => {

         if (err) {
            return next(err);
         }

         req.flash(
            "success",
            "Welcome to Wanderlust!"
         );

         res.redirect("/listings");

      });

   } catch (err) {

      req.flash("error", err.message);

      res.redirect("/signup");

   }

};

module.exports.login = (req, res) => {

   req.flash(
      "success",
      "Welcome back!"
   );

   let redirectUrl =
      res.locals.redirectUrl
      || "/listings";

   res.redirect(redirectUrl);

};
module.exports.logout = (req, res, next) => {

   req.logout((err) => {

      if (err) {
         return next(err);
      }

      req.flash("success", "Logged out!");

      res.redirect("/login");

   });

}
module.exports.forgotPassword =
   async (req, res) => {

      const { email } = req.body;

      const user =
         await User.findOne({ email });

      if (!user) {

         req.flash(
            "error",
            "No user with that email"
         );

         return res.redirect(
            "/forgot-password"
         );

      }

      const token =
         crypto.randomBytes(32)
            .toString("hex");

      user.resetToken = token;

      user.resetTokenExpiry =
         Date.now() + 3600000;

      await user.save();

      // send email here
      const resetURL =

         `http://localhost:8080/reset/${token}`;

      await transporter.sendMail({

         to: user.email,

         subject: "Password Reset",

         html: `

      <h2>Reset Password</h2>

      <p>Click below link:</p>

      <a href="${resetURL}">
         Reset Password
      </a>

   `,



      });
      req.flash(
         "success",
         "Reset link sent to email"
      );

      res.redirect("/login");

   };
module.exports.resetPassword =
   async (req, res) => {

      const { token } =
         req.params;

      const user =
         await User.findOne({

            resetToken: token,

            resetTokenExpiry: {
               $gt: Date.now()
            }

         });

      if (!user) {

         req.flash(
            "error",
            "Token expired"
         );

         return res.redirect(
            "/forgot-password"
         );

      }

      await user.setPassword(
         req.body.password
         
      );
      

      user.resetToken = undefined;

      user.resetTokenExpiry =
         undefined;
console.log(req.body);
      await user.save();

      req.flash(
         "success",
         "Password reset successful"
      );

      res.redirect("/login");

   };
module.exports.renderForgot =
(req,res)=>{

   res.render(
      "user/forgot.ejs"
   );

};

module.exports.renderReset =
(req,res)=>{

   res.render(
      "user/reset.ejs"
   );

};