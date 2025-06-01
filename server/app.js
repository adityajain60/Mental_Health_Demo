const express=require("express");
const app=express();
const { DBconnection } = require("./database/db.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require("cors");
require("dotenv").config();
app.use(
  cors({
    origin: ["https://mental-health-demo-vert.vercel.app"],
    credentials: true,
  })
);


const postRouter = require("./routers/postRoutes.js");
const userRouter = require("./routers/userRoutes.js");

app.use("/posts", postRouter);
app.use("/user", userRouter);


// const bcrypt = require("bcryptjs");
// const jwt = require('jsonwebtoken');
// const cookieParser = require("cookie-parser");





// app.use(cookieParser());
DBconnection();
app.get("/home", (req, res) => {
  res.send("Home Page");
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});



