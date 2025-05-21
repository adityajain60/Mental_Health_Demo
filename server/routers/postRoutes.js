const express =  require("express");

const postRouter = express.Router();

const {
  createPost,
  index,
  showPost,
  updatePost,
  destroyPost,
} = require("../controllers/postController.js");

postRouter.get("/getAllPosts", index);
postRouter.get("/getPost/:id", showPost);
postRouter.post("/createPost", createPost);
postRouter.put("/editPosts/:id", updatePost);
postRouter.delete("/deletePosts/:id", destroyPost);

module.exports = postRouter;


