require('dotenv').config();
const async = require('async');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require("bcryptjs"); 
const passport = require('passport');

exports.user_create_get = (req, res, next) => {
  if (req.user) {
    res.redirect("/")
  }
  res.render("pages/sign-up", { title: "New User Sign Up" });
}

exports.user_create_post = [
  body("first_name")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("First name required.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("last_name")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Last name required.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("username")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Username must not be empty.")
    .isLength({ max: 10 })
    .withMessage("Username too long (max 10 characters)"),
  body("password")
    .not()
    .isEmpty()
    .trim()
    .withMessage("Password must not be empty.")
    .isStrongPassword(
      {
        minLength: 8, 
        minLowercase: 1, 
        minUppercase: 1, 
        minSymbols: 1
      })
    .withMessage("Password is too weak. Must be min. 6 characters, 1 lowercase, 1 uppercase, and 1 symbol"),
  body("confirm_password")
    .custom((value,{req, loc, path}) => {
      if (value !== req.body.password) {
        // trow error if passwords do not match
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("pages/sign-up", { 
        title: "New User Sign Up",
        data: req.body,
        errors: errors.array(),
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        } 

        const user = new User({
          firstName: req.body.first_name,
          lastName: req.body.last_name,
          userName: req.body.username,
          password: hashedPassword,
          member: false,
          admin: false,
        });

        user.save((err) => {
          if (err) {
            console.log(err);
            return next(err);
          }
          passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/"
          })
        })
      })
    }
  },
];

exports.user_join_get = (req, res, next) => {
  res.render("pages/join-club", {
    title: "Join the Club",
    user: req.user,
  })
}

exports.user_join_post = [
  body("password", "Password must not be empty.")
    .trim()
    .escape()
    .isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.render("pages/join-club", {
        title: "Join the Club",
        user: req.user,
        password: req.body.password,
        errors: errors.array(),
      })
      return;
    } else if (req.body.password != process.env.club_pw) {
      res.render("pages/join-club", {
        title: "Join the Club",
        user: req.user,
        password: req.body.password,
        message: "Wrong password!"
      })
      return;
    } else {
      User.findByIdAndUpdate(req.user._id, { member: true }, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      })
    };
  },
];

exports.user_admin_get = (req, res, next) => {
  res.render("pages/admin-join", {
    title: "Become an Admin",
    user: req.user,
  })
}

exports.user_admin_post = [
  body("password", "Password must not be empty.")
    .trim()
    .escape()
    .isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.render("pages/admin-join", {
        title: "Become an Admin",
        user: req.user,
        password: req.body.password,
        errors: errors.array(),
      })
      return;
    } else if (req.body.password != process.env.admin_pw) {
      res.render("pages/admin-join", {
        title: "Become an Admin",
        user: req.user,
        password: req.body.password,
        message: "Wrong password!"
      })
      return;
    } else {
      User.findByIdAndUpdate(req.user._id, { admin: true }, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      })
    };
  },
];