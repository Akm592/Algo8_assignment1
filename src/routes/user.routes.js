// src/routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/:id", authMiddleware, userController.getUser);
router.put("/:id", authMiddleware,userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser); // Apply authMiddleware


module.exports = router;
