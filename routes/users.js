const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET sign-up page to create user
router.get("/sign-up", userController.user_create_get);

// POST request to save new user
router.post("/sign-up", userController.user_create_post);

// GET join page to join members only access
router.get("/join", userController.user_join_get);

// POST request to join members only access
router.post("/join", userController.user_join_post);

module.exports = router;