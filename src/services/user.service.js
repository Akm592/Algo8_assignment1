// src/services/user.service.js
const pool = require('../utils/db');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

async function createUser(user) {
  const { username, email, password } = user;
  const hashedPassword = await bcrypt.hash(password, 10); // Correct usage
  const [result] = await pool.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword]
  );
  return new User(result.insertId, username, email, hashedPassword);
}

async function getUserByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length > 0
      ? new User(rows[0].id, rows[0].username, rows[0].email, rows[0].password)
      : null;
}

// ... (previous code)

async function getUserById(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows.length > 0
    ? new User(rows[0].id, rows[0].username, rows[0].email, rows[0].password)
    : null;
}

async function updateUserById(id, updates) {
  const { username, email, password } = updates;
  // Hash password if provided
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  const query = "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?";
  const values = [username, email, hashedPassword, id];
  const [result] = await pool.query(query, values);
  return result.affectedRows === 1; // Indicate success or failure
}

async function deleteUserById(id) {
  const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows === 1; // Indicate success or failure
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById, 
  updateUserById, 
  deleteUserById, 
};