const express=require("express");
const app=express();
const { DBconnection } = require("./database/db.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const postRouter = require("./routers/postRoutes.js");
const userRouter = require("./routers/userRoutes.js");

app.use("/posts", postRouter);
app.use("/user", userRouter);


// const bcrypt = require("bcryptjs");
// const jwt = require('jsonwebtoken');
// const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// app.use(cookieParser());
DBconnection();
app.get("/home", (req, res) => {
  res.send("Home Page");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});



