const User = require( "../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const signup = async (req, res) => {
  try {
    const { name, email, password, gender, age, bio } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ error: "Email already exists" });
    }

    //HASH PASSWORD HERE

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //https://avatar.iran.liara.run/public/boy

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${email}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${email}`;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      age,
      bio,
      profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    const generateTokenAndSetCookie = (userId, res) => {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
      });
      res.cookie("jwt", token, { httpOnly: true });
    };

    if (newUser) {
      //Generate JWT token
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        bio: newUser.bio,
        profilePicture: newUser.profilePicture,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const generateTokenAndSetCookie = (userId, res) => {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
      });
      res.cookie("jwt", token, { httpOnly: true });
    };

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      bio: user.bio,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signup, login, logout };