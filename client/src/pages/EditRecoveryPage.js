import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecoveryForm from "../components/RecoveryForm";
import recoveryService from "../services/recoveryService";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "var(--card-background)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  loading: {
    textAlign: "center",
    color: "var(--text-color)",
  },
  error: {
    textAlign: "center",
    color: "red",
  },
};

function EditRecoveryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recovery, setRecovery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecovery = async () => {
      try {
        const data = await recoveryService.getRecoveryById(id);
        setRecovery(data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des données de paiement.");
        setLoading(false);
      }
    };
    fetchRecovery();
  }, [id]);

  const handleUpdateSubmit = async (formData) => {
    try {
      await recoveryService.updateRecovery(id, formData);
      navigate("/admin-dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de la mise à jour du paiement."
      );
      console.error("Update error:", err);
    }
  };

  if (loading)
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Chargement...</p>
      </div>
    );
  if (error)
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error}</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <RecoveryForm
        onSubmit={handleUpdateSubmit}
        initialData={recovery}
        isEditMode={true}
      />
    </div>
  );
}

export default EditRecoveryPage;
