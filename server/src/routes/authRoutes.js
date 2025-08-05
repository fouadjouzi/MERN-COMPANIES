const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// Route pour enregistrer un nouvel utilisateur
router.post("/register", registerUser);

// Route pour authentifier un utilisateur et obtenir un token
router.post("/login", loginUser);

module.exports = router;
