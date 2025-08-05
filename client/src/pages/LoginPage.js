import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Pour afficher les messages d'erreur
  const { login, isAuthenticated } = useAuth(); // Récupère la fonction login et l'état d'authentification
  const navigate = useNavigate(); // Hook pour la navigation

  // Redirige si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirige vers la page d'accueil si déjà connecté
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(""); // Réinitialise les erreurs

    try {
      await login(username, password); // Appelle la fonction de connexion du contexte
      // La redirection est gérée par l'useEffect ci-dessus ou par PublicRoute
    } catch (err) {
      // Gère les erreurs de connexion (ex: identifiants invalides)
      setError(err.response?.data?.message || "Erreur de connexion");
      console.error("Login error:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Connexion</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="username" style={styles.label}>
            Nom d'utilisateur :
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Mot de passe :
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}{" "}
        {/* Affiche l'erreur si elle existe */}
        <button type="submit" style={styles.button}>
          Se connecter
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    // Utilisation des variables CSS
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "var(--card-background)",
    color: "var(--text-color)", // Pour le texte général du conteneur
  },
  heading: {
    textAlign: "center",
    color: "var(--text-color)", // Utilisation de la variable
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "var(--text-color)", // Utilisation de la variable
  },
  input: {
    width: "100%",
    padding: "10px",
    // Utilisation des variables CSS
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    boxSizing: "border-box",
    backgroundColor: "var(--background-color)", // Fond de l'input
    color: "var(--text-color)", // Texte de l'input
  },
  select: {
    // Ajout de styles pour le select
    width: "100%",
    padding: "10px",
    // Utilisation des variables CSS
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    boxSizing: "border-box",
    fontSize: "16px",
    backgroundColor: "var(--background-color)", // Fond du select
    color: "var(--text-color)", // Texte du select
  },
  button: {
    padding: "10px 15px",
    // Utilisation des variables CSS pour les boutons primaires (peut être spécifique pour register si voulu)
    backgroundColor: "var(--primary-button-bg)" /* Ancien: #28a745 */,
    color: "var(--primary-button-text)" /* Ancien: white */,
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    textAlign: "center",
  },
  success: {
    color: "green",
    marginBottom: "10px",
    textAlign: "center",
  },
};

export default LoginPage;
