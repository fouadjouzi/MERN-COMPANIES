import React, { useState, useEffect } from "react";
import authService from "../services/authService"; // Utilise directement authService pour l'enregistrement
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("public"); // Par défaut 'public'
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Pour les messages de succès
  const { isAuthenticated } = useAuth(); // Pour la redirection si déjà connecté
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirige si déjà authentifié
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Appelle la fonction register du service d'authentification
      // Note: Pour l'enregistrement, on peut directement appeler authService.register
      // car on ne veut pas forcément se connecter automatiquement après l'enregistrement
      // (sauf si votre logique d'affaires le demande).
      // Si vous voulez vous connecter automatiquement, utilisez useAuth().login ici.
      const response = await authService.register({ username, password, role });
      setSuccess(`Utilisateur ${response.username} enregistré avec succès !`);
      // Optionnel: Réinitialiser le formulaire
      setUsername("");
      setPassword("");
      setRole("public");
      // Optionnel: Rediriger après un court délai
      // setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de l'enregistrement"
      );
      console.error("Register error:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Inscription</h2>
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
        <div style={styles.formGroup}>
          <label htmlFor="role" style={styles.label}>
            Rôle :
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
          >
            <option value="public">Public</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <button type="submit" style={styles.button}>
          S'inscrire
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
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
  },
  heading: {
    textAlign: "center",
    color: "#333",
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
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
  buttonHover: {
    backgroundColor: "#218838",
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

export default RegisterPage;
