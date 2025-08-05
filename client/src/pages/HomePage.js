import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import RecoveryForm from "../components/RecoveryForm";
import recoveryService from "../services/recoveryService";
import { Link, useNavigate } from "react-router-dom";

// Styles (peut être externalisé)
const styles = {
  container: {
    maxWidth: "1000px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "var(--card-background)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    color: "var(--text-color)",
    marginBottom: "20px",
  },
  userInfo: {
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "var(--background-color)",
    borderRadius: "5px",
    border: "1px solid var(--border-color)",
    textAlign: "center",
  },
  logoutButton: {
    padding: "8px 15px",
    backgroundColor: "var(--secondary-button-bg)",
    color: "var(--secondary-button-text)",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    color: "var(--text-color)",
  },
  th: {
    backgroundColor: "var(--background-color)",
    border: "1px solid var(--border-color)",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    border: "1px solid var(--border-color)",
    padding: "10px",
    textAlign: "left",
  },
  buttonGroup: {
    display: "flex",
    gap: "5px",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    padding: "6px 10px",
    backgroundColor: "var(--primary-button-bg)",
    color: "var(--primary-button-text)",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "12px",
  },
  deleteButton: {
    padding: "6px 10px",
    backgroundColor: "var(--secondary-button-bg)",
    color: "var(--secondary-button-text)",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    fontSize: "12px",
  },
};

function HomePage() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [recoveries, setRecoveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fonction pour charger les paiements de recouvrement
  const fetchRecoveries = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await recoveryService.getRecoveries();
      setRecoveries(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors du chargement des paiements."
      );
      console.error("Fetch recoveries error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Charger les paiements au montage du composant
  useEffect(() => {
    fetchRecoveries();
  }, []);

  // Gère la soumission du formulaire de création
  const handleCreateSubmit = async (formData) => {
    setError("");
    try {
      await recoveryService.createRecovery(formData);
      await fetchRecoveries(); // Recharge la liste après la création
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de la création du paiement."
      );
      console.error("Create recovery error:", err);
    }
  };

  // Gère la suppression d'un paiement (admin only)
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce paiement ?")) {
      return;
    }
    setError("");
    try {
      await recoveryService.deleteRecovery(id);
      await fetchRecoveries(); // Recharge la liste après la suppression
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de la suppression du paiement."
      );
      console.error("Delete recovery error:", err);
    }
  };

  if (loading)
    return (
      <div style={styles.container}>
        <p style={{ color: "var(--text-color)" }}>
          Chargement des paiements...
        </p>
      </div>
    );
  if (error)
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error}</p>
      </div>
    );

  return (
    <>
      <div className="container" style={styles.container}>
        <h2 style={styles.heading}>Page d'Accueil (Accès Public)</h2>
        {isAuthenticated ? (
          <div style={styles.userInfo}>
            <p style={{ color: "var(--text-color)" }}>
              Bienvenue, {user.username} ! (Rôle : {user.role})
            </p>
            <button onClick={logout} style={styles.logoutButton}>
              Déconnexion
            </button>
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "var(--text-color)" }}>
            Vous n'êtes pas connecté. Connectez-vous pour accéder aux
            fonctionnalités d'administration.
          </p>
        )}

        <hr style={{ margin: "30px 0", borderColor: "var(--border-color)" }} />

        <RecoveryForm onSubmit={handleCreateSubmit} />

        <hr style={{ margin: "30px 0", borderColor: "var(--border-color)" }} />

        <h3 style={styles.heading}>Liste des Paiements de Recouvrement</h3>
        {recoveries.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-color)" }}>
            Aucun paiement de recouvrement à afficher.
          </p>
        ) : (
          <table style={styles.table}>
            <thead>
              {/* CORRECTION ICI : Pas d'espaces/retours à la ligne entre <tr> et <th>, ni entre les <th> */}
              <tr>
                <th style={styles.th}>KOMPASS ID</th>
                <th style={styles.th}>Client</th>
                <th style={styles.th}>Banque</th>
                <th style={styles.th}>Montant Dû</th>
                <th style={styles.th}>Montant Payé</th>
                <th style={styles.th}>Agent</th>
                <th style={styles.th}>Paiement Total</th>
                <th style={styles.th}>Date</th>
                {isAdmin && <th style={styles.th}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {recoveries.map((recovery) => (
                <tr key={recovery._id}>
                  {/* CORRECTION ICI : Pas d'espaces/retours à la ligne entre <tr> et <td>, ni entre les <td> */}
                  <td style={styles.td}>{recovery.kompassId}</td>
                  <td style={styles.td}>{recovery.clientName}</td>
                  <td style={styles.td}>{recovery.bankName}</td>
                  <td style={styles.td}>{recovery.amountDue}</td>
                  <td style={styles.td}>{recovery.amountPaid}</td>
                  <td style={styles.td}>{recovery.agentName}</td>
                  <td style={styles.td}>
                    {recovery.isFullPayment ? "Oui" : "Non"}
                  </td>
                  <td style={styles.td}>
                    {new Date(recovery.paymentDate).toLocaleDateString()}
                  </td>
                  {isAdmin && (
                    <td style={styles.td}>
                      <div style={styles.buttonGroup}>
                        <Link
                          to={`/edit/${recovery._id}`}
                          style={{ textDecoration: "none" }}
                        >
                          <button style={styles.editButton}>Modifier</button>
                        </Link>
                        <button
                          onClick={() => handleDelete(recovery._id)}
                          style={styles.deleteButton}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default HomePage;
