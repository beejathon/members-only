const { body, validationResult } = require('express-validator');
const Post = require("../models/post");
const mongoose = require('mongoose');

exports.message_create_get = (req, res, next) => {
  res.render("pages/new-post", {
    user: req.user,
    title: "New Post",
  });
}

exports.message_create_post = [
  body("subject", "Subject must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .optional({ nullable: true, checkFalsy: true }),
  body("message", "Message must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .optional({ nullable: true, checkFalsy: true }),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("pages/new-post", {
        user: req.user,
        title: "New Post",
        subject: req.body.subject,
        message: req.body.message,
        errors: errors.array(),
      });
    } else {
      const post = new Post({
        subject: req.body.subject,
        message: req.body.message,
        date: Date.now(),
        user: mongoose.Types.ObjectId(req.user._id),
      }); 
      post.save((err) => {
        if (err) {
          console.log(err);
          return next(err);
        }
        res.redirect("/");
      });     
    } 
  },
];

exports.message_delete_get = (req, res, next) => {
  Post.findById(req.params.id)
    .populate("user")
    .exec(function (err, post) {
      if (err) {
        return next(err);
      }
      res.render("pages/message-delete", {
        title: "Delete Message",
        user: req.user,
        post: post,
      })
    });
};

exports.message_delete_post = (req, res, next) => {
  Post.findByIdAndRemove(req.body.postid, (err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/")
  })
}