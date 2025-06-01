const Anonymous = require("../models/anonymousPost.js");
const jwt = require("jsonwebtoken");
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
    const userId = req.userId; // set by middleware

    const { title, article, options, tags } = req.body;
    if (!title || !article) {
      return res.status(400).json({ error: "Title and article are required" });
    }

    const newPost = new Anonymous({
      title,
      article,
      options,
      tags,
      createdBy: userId,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create post" });
  }
};
// updatePost
module.exports.updatePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const post = await Anonymous.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.createdBy.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const { title, article, options, tags } = req.body;
    if (!title || !article) {
      return res.status(400).json({ error: "Title and article are required" });
    }
    post.title = title;
    post.article = article;
    post.options = options;
    post.tags = tags;
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to update post" });
  }
};

// destroyPost
module.exports.destroyPost = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const post = await Anonymous.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.createdBy.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message || "Failed to delete post" });
  }
};







































