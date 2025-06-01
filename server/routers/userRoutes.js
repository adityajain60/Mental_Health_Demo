const express =  require("express");
const {
  login,
  signup,
  logout,
  getUserById,
  getUserPosts,
  updateUser,
} = require("../controllers/userControllers.js");

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.get("/logout", logout);
userRouter.get("/:id", getUserById);
userRouter.get("/:id/posts", getUserPosts);
userRouter.put("/:id", updateUser);

module.exports = userRouter;
