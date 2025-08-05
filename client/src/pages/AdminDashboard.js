import React from "react";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Tableau de Bord Admin (Accès Protégé)</h2>
      {user && (
        <p>
          Bienvenue sur le tableau de bord administrateur, {user.username} !
        </p>
      )}
      <p>
        Seuls les utilisateurs avec le rôle 'admin' peuvent voir cette page.
      </p>
      {/* Ici, nous ajouterons les fonctionnalités d'édition et de suppression */}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "50px auto",
    padding: "20px",
    // Utilisation des variables CSS
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    backgroundColor: "var(--card-background)",
    color: "var(--text-color)", // Pour le texte général du conteneur
    textAlign: "center",
  },
  heading: {
    color: "var(--text-color)", // Utilisation de la variable
    marginBottom: "20px",
  },
};

export default AdminDashboard;
