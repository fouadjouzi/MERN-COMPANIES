import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importe votre hook useAuth

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth(); // Récupère l'état d'authentification et l'utilisateur

  // 1. Vérifie si l'utilisateur est authentifié
  if (!isAuthenticated) {
    // Si non authentifié, redirige vers la page de connexion
    return <Navigate to="/login" replace />;
  }

  // 2. Si un rôle est requis, vérifie le rôle de l'utilisateur
  if (requiredRole && (!user || user.role !== requiredRole)) {
    // Si le rôle ne correspond pas, redirige vers la page d'accueil (ou une page d'erreur)
    // Vous pouvez ajuster la redirection ici si vous voulez une page "Accès refusé"
    return <Navigate to="/" replace />;
  }

  // Si authentifié et le rôle correspond (ou aucun rôle n'est requis), affiche le composant enfant
  return children;
};

export default PrivateRoute;
