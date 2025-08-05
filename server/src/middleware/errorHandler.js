// Middleware pour gérer les routes non trouvées (404)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404); // Assurez-vous que le status est défini ici
  next(error);
};

// Middleware général de gestion des erreurs
const errorHandler = (err, req, res, next) => {
  // Assurez-vous que res.statusCode est défini, sinon utilisez 500 (Internal Server Error)
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
