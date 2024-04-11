// src/controllers/user.controller.js
const userService = require("../services/user.service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator"); // Assuming you've installed express-validator

async function registerUser(req, res) {
const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
    const user = await userService.createUser({ username, email, password });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Email already registered" });
    }
    res.status(400).json({ message: err.message });
  }
}
async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await userService.getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
}


async function getUser(req, res) {
  const userId = req.params.id;
  const loggedInUserId = req.user.userId; // Assuming auth middleware sets req.user

  try {
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Check for user existence first
    }

    // Authorization Check (only if the user exists)
    if (loggedInUserId !== parseInt(userId, 10)) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this user data" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateUser(req, res) {
  const userIdToUpdate = req.params.id;
  const updates = req.body;
  const loggedInUserId = req.user.userId;

  // Authorization Check
  if (loggedInUserId !== parseInt(userIdToUpdate, 10)) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this user" });
  }

  try {
    const success = await userService.updateUserById(userIdToUpdate, updates);

    if (success) {
      res.json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}



async function deleteUser(req, res) {
  const userIdToDelete = req.params.id;
  const loggedInUserId = req.user.userId; // Assuming auth middleware sets req.user

  // Authorization Check: Ensure the logged-in user is deleting their own account
  if (loggedInUserId !== parseInt(userIdToDelete, 10)) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this user" });
  }

  try {
    const success = await userService.deleteUserById(userIdToDelete);
    if (!success) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


module.exports = {
  registerUser,
  loginUser,
  getUser, 
  updateUser, 
  deleteUser, 
};
