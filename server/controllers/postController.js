const Anonymous = require("../models/anonymousPost.js");

// Get all anonymous posts
module.exports.index = async (req, res) => {
  try {
    const allPosts = await Anonymous.find({});
    res.status(200).json(allPosts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};


// Show a single post by ID
module.exports.showPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Anonymous.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

// Create a new anonymous post
module.exports.createPost = async (req, res) => {
  try {
    const newPost = new Anonymous(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: "Failed to create post" });
  }
};

// Update a post
module.exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPost = await Anonymous.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: "Failed to update post" });
  }
};

// Delete a post
module.exports.destroyPost = async (req, res) => {
  try {
    const { id } = req.params;
    await Anonymous.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete post" });
  }
};
