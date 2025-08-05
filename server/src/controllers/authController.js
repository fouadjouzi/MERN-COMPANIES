const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Fonction utilitaire pour générer un JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Le token expire après 1 heure
  });
};

// @desc    Enregistrer un nouvel utilisateur (pour l'admin, peut être supprimé après création initiale)
// @route   POST /api/auth/register
// @access  Public (pour la création initiale d'un admin)
const registerUser = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      res.status(400);
      throw new Error('Veuillez entrer un nom d\'utilisateur et un mot de passe.');
    }

    const userExists = await User.findOne({ username });

    if (userExists) {
      res.status(400);
      throw new Error('Cet nom d\'utilisateur existe déjà.');
    }

    // Créer un nouvel utilisateur
    const user = await User.create({
      username,
      password, // Le mot de passe sera haché par le middleware pre('save') du modèle
      role: role || 'public', // Définir le rôle, par défaut à 'public'
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id, user.role), // Générer et envoyer le token
      });
    } else {
      res.status(400);
      throw new Error('Données utilisateur invalides');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authentifier un utilisateur et obtenir un token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) { // Utilise la méthode matchPassword du modèle
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id, user.role), // Générer et envoyer le token
      });
    } else {
      res.status(401); // 401 Unauthorized
      throw new Error('Nom d\'utilisateur ou mot de passe invalide');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
};