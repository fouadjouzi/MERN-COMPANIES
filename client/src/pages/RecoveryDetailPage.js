import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import recoveryService from "../services/recoveryService";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "30px",
    backgroundColor: "var(--card-background)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
    color: "var(--text-color)",
  },
  detailGroup: {
    marginBottom: "15px",
    padding: "10px",
    borderBottom: "1px dotted var(--border-color)",
  },
  label: {
    fontWeight: "bold",
    marginRight: "10px",
    color: "var(--link-color)",
  },
  value: {
    fontWeight: "normal",
    color: "var(--text-color)",
  },
  error: {
    textAlign: "center",
    color: "red",
  },
  loading: {
    textAlign: "center",
    color: "var(--text-color)",
  },
};

function RecoveryDetailPage() {
  const { id } = useParams(); // ID du paiement unique (_id MongoDB)
  const [recovery, setRecovery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await recoveryService.getRecoveryById(id);
        setRecovery(data);
      } catch (err) {
        setError(`Paiement non trouvé pour l'ID : ${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Chargement des détails du paiement...</p>
      </div>
    );
  if (error)
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  if (!recovery)
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Paiement non trouvé.</p>
      </div>
    );

  const montantTotal = Number(recovery.amountDue) || 0;
  const montantPaye = Number(recovery.amountPaid) || 0;
  const resteAPayer = montantTotal - montantPaye;

  return (
    <div style={styles.container} className="container">
      <h1
        style={{
          color: "var(--text-color)",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Détail du Paiement #{id.substring(0, 8)}...
      </h1>

      <div style={styles.detailGroup}>
        <span style={styles.label}>KOMPASS ID :</span>
        <Link
          to={`/company/${recovery.kompassId}`}
          style={{ color: "var(--link-color)", fontWeight: "bold" }}
        >
          {recovery.kompassId}
        </Link>
      </div>

      <div style={styles.detailGroup}>
        <span style={styles.label}>Client :</span>
        <span style={styles.value}>{recovery.clientName}</span>
      </div>

      <div style={styles.detailGroup}>
        <span style={styles.label}>Banque :</span>
        <span style={styles.value}>{recovery.bankName}</span>
      </div>

      <div style={styles.detailGroup}>
        <span style={styles.label}>Montant Total Dû :</span>
        <span style={styles.value}>{montantTotal.toFixed(2)} DA</span>
      </div>

      <div style={styles.detailGroup}>
        <span style={styles.label}>Montant Payé :</span>
        <span style={styles.value}>{montantPaye.toFixed(2)} DA</span>
      </div>

      <div
        style={{
          ...styles.detailGroup,
          fontWeight: "bold",
          fontSize: "1.2em",
          color: resteAPayer > 0 ? "red" : "green",
        }}
      >
        <span style={styles.label}>Solde Restant :</span>
        <span>{resteAPayer.toFixed(2)} DA</span>
      </div>

      <div style={styles.detailGroup}>
        <span style={styles.label}>Date de Facture :</span>
        <span style={styles.value}>
          {recovery.invoiceDate
            ? new Date(recovery.invoiceDate).toLocaleDateString()
            : "N/A"}
        </span>
      </div>

      <div style={styles.detailGroup}>
        <span style={styles.label}>Date Paiement :</span>
        <span style={styles.value}>
          {new Date(recovery.paymentDate).toLocaleDateString()}
        </span>
      </div>

      <div style={styles.detailGroup}>
        <span style={styles.label}>Année d'Édition :</span>
        <span style={styles.value}>{recovery.editionYear}</span>
      </div>

      <div style={styles.detailGroup}>
        <span style={styles.label}>Agent :</span>
        <span style={styles.value}>{recovery.agentName}</span>
      </div>

      <Link
        to={`/company/${recovery.kompassId}`}
        style={{ display: "block", textAlign: "center", marginTop: "20px" }}
      >
        Retour au Dashboard Entreprise
      </Link>
    </div>
  );
}

export default RecoveryDetailPage;
