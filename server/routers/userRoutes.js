const express =  require("express");
const { login, signup, logout } = require("../controllers/userControllers.js");

const userRouter = express.Router();

userRouter.post("/login", login);
userRouter.post("/signup", signup);
userRouter.get("/logout", logout);

module.exports = userRouter;
