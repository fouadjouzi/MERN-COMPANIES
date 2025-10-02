import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import RecoveryForm from "../components/RecoveryForm";
import recoveryService from "../services/recoveryService";
import { Link, useNavigate } from "react-router-dom";

// Styles
const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    color: "var(--text-color)",
    marginBottom: "20px",
  },
  userInfo: {
    marginBottom: "20px",
    textAlign: "center",
  },
  logoutButton: {
    background: "var(--danger-color)",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    cursor: "pointer",
    borderRadius: "5px",
    marginTop: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid var(--border-color)",
    padding: "10px",
    background: "var(--primary-color)",
    color: "#fff",
  },
  td: {
    border: "1px solid var(--border-color)",
    padding: "10px",
    textAlign: "center",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  editButton: {
    background: "var(--primary-color)",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "5px",
  },
  deleteButton: {
    background: "var(--danger-color)",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

function HomePage() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [recoveries, setRecoveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 📌 Récupération des paiements
  async function fetchRecoveries() {
    try {
      setLoading(true);
      const data = await recoveryService.getRecoveries(); // ✅ corrigé ici
      setRecoveries(data);
      setError("");
    } catch (err) {
      setError("Erreur lors du chargement des paiements.");
    } finally {
      setLoading(false);
    }
  }

  // 📌 Création d’un nouveau paiement
  async function handleCreateSubmit(newRecovery) {
    try {
      const created = await recoveryService.createRecovery(newRecovery);
      setRecoveries((prev) => [...prev, created]);
    } catch (err) {
      setError("Erreur lors de la création du paiement.");
    }
  }

  // 📌 Suppression d’un paiement
  async function handleDelete(id) {
    try {
      await recoveryService.deleteRecovery(id);
      setRecoveries((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression du paiement.");
    }
  }

  // Charger les données au montage
  useEffect(() => {
    fetchRecoveries();
  }, []);

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
        <p style={{ color: "red" }}>{error}</p>
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

        {/* Formulaire d'ajout */}
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
              <tr>
                <th style={styles.th}>KOMPASS ID</th>
                <th style={styles.th}>Client</th>
                <th style={styles.th}>Banque</th>
                <th style={styles.th}>Montant Dû (Initial)</th>
                <th style={styles.th}>Montant Payé</th>
                <th style={styles.th}>Reste à Payer</th>
                <th style={styles.th}>Agent</th>
                <th style={styles.th}>Paiement Total</th>
                <th style={styles.th}>Date Facture</th>
                <th style={styles.th}>Date Paiement</th>
                <th style={styles.th}>Année d'Édition</th>
                {isAdmin && <th style={styles.th}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {recoveries.map((recovery) => {
                const resteAPayer =
                  (recovery.amountDue || 0) - (recovery.amountPaid || 0);

                return (
                  <tr key={recovery._id}>
                    <td style={styles.td}>
                      <Link
                        to={`/company/${recovery.kompassId}`}
                        style={{
                          color: "var(--link-color)",
                          fontWeight: "bold",
                        }}
                      >
                        {recovery.kompassId}
                      </Link>
                    </td>
                    <td style={styles.td}>{recovery.clientName}</td>
                    <td style={styles.td}>{recovery.bankName}</td>
                    <td style={styles.td}>{recovery.amountDue}</td>
                    <td style={styles.td}>{recovery.amountPaid}</td>
                    <td style={styles.td}>
                      {resteAPayer > 0
                        ? `${resteAPayer.toFixed(2)} DA`
                        : "Payé"}
                    </td>
                    <td style={styles.td}>{recovery.agentName}</td>
                    <td style={styles.td}>
                      {recovery.isFullPayment ? "Oui" : "Non"}
                    </td>
                    <td style={styles.td}>
                      {recovery.invoiceDate
                        ? new Date(recovery.invoiceDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td style={styles.td}>
                      {new Date(recovery.paymentDate).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>{recovery.editionYear}</td>

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
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default HomePage;
