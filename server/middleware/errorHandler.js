// Middleware pour gérer les routes non trouvées (404)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Passe l'erreur au prochain middleware (errorHandler)
};

// Middleware général de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Si le statut est 200 (OK), mais qu'il y a une erreur, on passe à 500 (Internal Server Error)
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Affiche la stack trace en dev, mais pas en production pour des raisons de sécurité
  });
};

module.exports = { notFound, errorHandler };
