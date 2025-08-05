const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler"); // Aide à gérer les erreurs asynchrones

// Ce module n'est pas inclus par défaut avec express
// installez-le: npm install express-async-handler
// C'est un utilitaire qui va wrapper vos fonctions asynchrones
// pour qu'elles passent automatiquement les erreurs à next(error)

// Middleware pour protéger les routes et authentifier l'utilisateur
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Vérifie si le token est présent dans l'en-tête Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraire le token (ignorer "Bearer ")
      token = req.headers.authorization.split(" ")[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Trouver l'utilisateur sans le mot de passe et l'attacher à req.user
      req.user = await User.findById(decoded.id).select("-password"); // Exclure le mot de passe
      req.user.role = decoded.role; // Récupérer le rôle depuis le token pour s'assurer qu'il est à jour

      next(); // Passer au middleware ou au contrôleur suivant
    } catch (error) {
      console.error(error);
      res.status(401); // 401 Unauthorized
      throw new Error("Non autorisé, token invalide");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Non autorisé, pas de token");
  }
});

module.exports = { protect };
