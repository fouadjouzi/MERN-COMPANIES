import React, { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService"; // Importe le service d'authentification
import axios from "axios"; // Pour configurer l'intercepteur Axios

// 1. Création du Contexte
const AuthContext = createContext(null);

// 2. Création du Fournisseur de Contexte (AuthProvider)
export const AuthProvider = ({ children }) => {
  // État pour stocker les informations de l'utilisateur (initialisé à partir du localStorage)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  // 3. Effet pour configurer l'intercepteur Axios et synchroniser l'état
  useEffect(() => {
    // Intercepteur de requêtes Axios: ajoute le token aux requêtes sortantes
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.token) {
            config.headers.Authorization = `Bearer ${parsedUser.token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur de réponses Axios: gère les tokens expirés ou invalides
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // 401 Unauthorized
          console.log("Token expired or unauthorized, logging out user.");
          // Si le token est expiré ou invalide, déconnectez l'utilisateur
          logout(); // Appel à la fonction logout du contexte
        }
        return Promise.reject(error);
      }
    );

    // Nettoyage des intercepteurs quand le composant est démonté
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []); // Le tableau vide signifie que cet effet ne s'exécute qu'une seule fois au montage

  // Fonctions d'authentification/déconnexion qui mettent à jour l'état et le localStorage
  const login = async (username, password) => {
    const userData = await authService.login({ username, password });
    setUser(userData); // Met à jour l'état user
    return userData;
  };

  const logout = () => {
    authService.logout();
    setUser(null); // Réinitialise l'état user à null
  };

  // Les valeurs qui seront disponibles pour les composants qui utilisent ce contexte
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user, // true si user n'est pas null
    isAdmin: user && user.role === "admin", // true si user est admin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};
