const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/jwt.middleware");
const { AppError } = require("../error-handling/index");
const Post = require("../models/Post.model");

// Create a Post

router.post("/post", authenticateToken, async (req, res, next) => {
  try {
    const { title, message, creator, tags } = req.body;

    const user = req.playload.userId;

    const newPost = new Post({
      title,
      message,
      creator,
      tags,
    });

    const createdPost = await newPost.save();
    res.status(201).json(createdPost);
  } catch (error) {
    next(new AppError("Failed to create post", 500));
  }
});

// GET all posts

router.get("/posts", async (req, res, next) => {
  try {
    const posts = await Post.find().populate("user", "username");
    res.status(200).json({ posts });
  } catch (error) {
    next(new AppError("Post not found", 404));
  }
});

// GET a single post

router.get("/post/:postId", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId).populate(
      "user",
      "username"
    );
    if (!post) {
      throw new AppError("Post not found", 404);
    }
    res.status(200).json(post);
  } catch (error) {
    next(new AppError("Error fetching post", 500));
  }
});

// PUT to update an opost

router.put("/post/:postId", authenticateToken, async (req, res, next) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true }
    );
    if (!updatedPost) {
      throw new AppError("Post not found", 404);
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    next(new AppError("Error updating post", 500));
  }
});

// DELETE an offer

router.delete("/posts/:postId", authenticateToken, async (req, res, next) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.postId);
    if (!deletedPost) {
      throw new AppError("Could not delete offer", 404);
    }
    res.status(204).end();
  } catch (error) {
    next(new AppError("Error deleting offer", 500));
  }
});
