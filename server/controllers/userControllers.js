const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require("../models/anonymousPost.js");

const signup = async (req, res) => {
  try {
    const { name, email, password, gender, age, bio } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${email}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${email}`;

    const profilePicture =
      gender.toLowerCase() === "male"
        ? boyProfilePic
        : gender.toLowerCase() === "female"
        ? girlProfilePic
        : "";

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      age,
      bio,
      profilePicture,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
    res.cookie("jwt", token, { httpOnly: true });

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      age: newUser.age,
      bio: newUser.bio,
      profilePicture: newUser.profilePicture,
      token, // <-- send token in response for frontend
    });
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

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
    res.cookie("jwt", token, { httpOnly: true });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      bio: user.bio,
      profilePicture: user.profilePicture,
      token, // <-- send token in response for frontend
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

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;
    // Find posts where createdBy matches the user id
    const posts = await Post.find({ createdBy: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user's posts" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, bio } = req.body;

    // Only allow updating specific fields
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (age !== undefined) updateFields.age = age;
    if (gender !== undefined) updateFields.gender = gender;
    if (bio !== undefined) updateFields.bio = bio;

    // Optionally, update profilePicture if gender changes
    if (gender) {
      const user = await User.findById(id);
      if (user && user.gender !== gender) {
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${user.email}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${user.email}`;
        updateFields.profilePicture =
          gender.toLowerCase() === "male"
            ? boyProfilePic
            : gender.toLowerCase() === "female"
            ? girlProfilePic
            : user.profilePicture;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateUser controller", error.message);
    res.status(500).json({ error: "Failed to update user" });
  }
};


module.exports = { signup, login, logout, getUserById, getUserPosts, updateUser };

