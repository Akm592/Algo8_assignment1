// src/controllers/post.controller.js
const postService = require("../services/post.service");
const { body ,validationResult } = require("express-validator"); // Assuming you've installed express-validator

async function createPost(req, res) {
  await body("title").notEmpty().withMessage("Title is required").run(req);
  await body("content").notEmpty().withMessage("Content is required").run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content } = req.body;
  const user_id = req.user.userId;

  try {
    const post = await postService.createPost({ title, content, user_id });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getAllPosts(req, res) {
  try {
    const posts = await postService.getAllPosts();
    // Directly return the posts array
    return res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
  

async function getPost(req, res) {
  const postId = req.params.id;
  try {
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
} 

async function updatePost(req, res) {
  const postId = req.params.id;
  const updates = req.body;
  const userId = req.user.userId; // Get the ID of the logged-in user

  try {
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the logged-in user is the author of the post
    if (post.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    const success = await postService.updatePostById(postId, updates);
    if (!success) {
      return res.status(400).json({ message: "Failed to update post" });
    }
    res.json({ message: "Post updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function deletePost(req, res) {
  const postId = req.params.id;
  const userId = req.user.userId;

  try {
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    const success = await postService.deletePostById(postId);
    if (!success) {
      return res.status(400).json({ message: "Failed to delete post" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}





async function deletePost(req, res) {
  const postId = req.params.id;
  const userId = req.user.userId;

  try {
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    const success = await postService.deletePostById(postId);
    if (!success) {
      return res.status(400).json({ message: "Failed to delete post" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getFilteredPosts(req, res) {
  const { user_id, title, ...otherFilters } = req.query; // Extract filters

  try {
    const posts = await postService.getFilteredPosts({
      user_id,
      title,
      ...otherFilters,
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


module.exports = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  getFilteredPosts,

};
