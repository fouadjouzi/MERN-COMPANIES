import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Importe votre hook useAuth

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Récupère l'état d'authentification

  // Si l'utilisateur est déjà authentifié, redirige vers la page d'accueil
  // Ceci est utile pour empêcher un utilisateur connecté d'accéder à /login ou /register
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si l'utilisateur n'est pas authentifié, affiche le composant enfant
  return children;
};

export default PublicRoute;
