import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecoveryForm from "../components/RecoveryForm";
import recoveryService from "../services/recoveryService";
import { useAuth } from "../context/AuthContext"; // Pour la protection de la route

// Styles (peut être externalisé)
const styles = {
  container: {
    maxWidth: "500px",
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
  error: {
    color: "red",
    marginTop: "20px",
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    marginTop: "50px",
    color: "var(--text-color)", // Texte de chargement
  },
};

function EditRecoveryPage() {
  const { id } = useParams(); // Récupère l'ID du paiement depuis l'URL (ex: /edit/60c72b2f9f1b2c001c8e4d5f)
  const navigate = useNavigate();
  const [recoveryData, setRecoveryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, isAdmin } = useAuth(); // Pour gérer l'accès

  // Effet pour charger les données du paiement au montage de la page
  useEffect(() => {
    // Protection côté client pour les routes protégées
    if (!isAuthenticated || !isAdmin) {
      navigate("/login"); // Ou '/' si vous préférez
      return;
    }

    const fetchRecovery = async () => {
      try {
        const data = await recoveryService.getRecoveryById(id);
        setRecoveryData(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Erreur lors du chargement des données."
        );
        console.error("Fetch recovery by ID error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecovery();
  }, [id, isAuthenticated, isAdmin, navigate]); // Dépendances importantes pour re-exécuter l'effet

  // Gère la soumission du formulaire de modification
  const handleEditSubmit = async (formData) => {
    setError("");
    try {
      await recoveryService.updateRecovery(id, formData);
      navigate("/"); // Redirige vers la page d'accueil après la modification
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de la mise à jour du paiement."
      );
      console.error("Update recovery error:", err);
    }
  };

  if (loading)
    return (
      <div style={styles.loading}>
        <p>Chargement des données du paiement...</p>
      </div>
    );
  if (error)
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  if (!recoveryData)
    return (
      <div style={styles.container}>
        <p>Paiement non trouvé.</p>
      </div>
    );

  return (
    <RecoveryForm
      onSubmit={handleEditSubmit}
      initialData={recoveryData}
      isEditMode={true} // Indique que le formulaire est en mode édition
    />
  );
}

export default EditRecoveryPage;
