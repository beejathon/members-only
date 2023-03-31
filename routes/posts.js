const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

// GET create new message form
router.get("/create", postController.message_create_get);

// POST request to create new message
router.post("/create", postController.message_create_get);

// GET delete post confirmation
router.get("/post/:id/delete", postController.message_delete_get);

// POST request to delete post
router.post("/post/:id/delete", postController.message_delete_post);

module.exports = router;