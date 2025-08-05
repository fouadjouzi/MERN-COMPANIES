// Middleware pour autoriser l'accès en fonction du rôle de l'utilisateur
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // req.user est défini par le middleware 'protect'
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // 403 Forbidden
      throw new Error(
        "Accès refusé, vous n'avez pas la permission pour cette action"
      );
    }
    next();
  };
};

module.exports = { authorizeRoles };
