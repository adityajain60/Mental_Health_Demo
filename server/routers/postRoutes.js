const express = require("express");
const postRouter = express.Router();

const {
  createPost,
  index,
  showPost,
  updatePost,
  destroyPost,
} = require("../controllers/postController.js");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
postRouter.get("/getAllPosts", index);
postRouter.get("/getPost/:id", showPost);

// Protected routes
postRouter.post("/createPost", authMiddleware, createPost);
postRouter.put("/editPosts/:id", authMiddleware, updatePost);
postRouter.delete("/deletePosts/:id", authMiddleware, destroyPost);

module.exports = postRouter;
