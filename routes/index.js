const async = require('async');
const express = require("express");
const router = express.Router();
const Post = require('../models/post')

/* GET home page */
router.get("/", function(req, res, next) {
  Post.find({})
    .sort({ date: 1 })
    .populate("user")
    .exec(function (err, posts) {
      if (err) {
        return next(err);
      }
      res.render("pages/index", { 
        user: req.user,
        title: "Home Page", 
        posts: posts,
      });
    })
});

module.exports = router;