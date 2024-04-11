// src/services/post.service.js
const pool = require("../utils/db");
const Post = require("../models/post.model");

async function createPost(post) {
  const { title, content, user_id } = post;
  const [result] = await pool.query(
    "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
    [title, content, user_id]
  );
  return new Post(result.insertId, title, content, user_id);
}

async function getAllPosts() {
  const [rows] = await pool.query("SELECT * FROM posts");
  // Ensure you're mapping rows to an array of Post objects
  return rows.map(
    (row) =>
      new Post(row.id, row.title, row.content, row.user_id, row.createdAt)
  ); 
}



async function getPostById(id) {
  const [rows] = await pool.query("SELECT * FROM posts WHERE id = ?", [id]);
  return rows.length > 0
    ? new Post({
        id: rows[0].id,
        title: rows[0].title,
        content: rows[0].content,
        user_id: rows[0].user_id,
        createdAt: rows[0].createdAt,
        // Add other properties as needed
      })
    : null;
}
async function updatePostById(id, updates) {
  const { title, content } = updates;
  const [result] = await pool.query(
    "UPDATE posts SET title = ?, content = ? WHERE id = ?",
    [title, content, id]
  );
  return result.affectedRows === 1; 
}

async function deletePostById(id) {
  const [result] = await pool.query("DELETE FROM posts WHERE id = ?", [id]);
  return result.affectedRows === 1; 
}
async function getPaginatedPosts(page, limit) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query("SELECT * FROM posts LIMIT ? OFFSET ?", [
    limit,
    offset,
  ]);
  return rows.map(
    (row) =>
      new Post(row.id, row.title, row.content, row.user_id, row.createdAt)
  ); // Map to Post objects
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  getPaginatedPosts,
  


};
