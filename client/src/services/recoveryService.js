import axios from "axios";

// URL de base de l'API (configurable via .env)
const API_URL = `${
  process.env.REACT_APP_API_URL || "http://localhost:5000"
}/api/recoveries/`;

// Fonction pour obtenir le token utilisateur depuis localStorage
const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.token : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
};

// ---------- CRUD OPERATIONS ----------

// Créer un nouveau paiement de recouvrement
const createRecovery = async (recoveryData) => {
  try {
    const response = await axios.post(API_URL, recoveryData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Erreur lors de la création du recouvrement."
    );
  }
};

// Récupérer tous les paiements (optionnellement filtrés par kompassId)
const getRecoveries = async (kompassId = null) => {
  try {
    let url = API_URL;
    if (kompassId) url += `?kompassId=${kompassId}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Erreur lors du chargement des recouvrements."
    );
  }
};

// Récupérer un paiement par ID
const getRecoveryById = async (id) => {
  try {
    const response = await axios.get(API_URL + id);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Erreur lors de la récupération du recouvrement."
    );
  }
};

// Mettre à jour un paiement (token nécessaire)
const updateRecovery = async (id, recoveryData) => {
  const token = getToken();
  if (!token) throw new Error("Utilisateur non authentifié.");

  try {
    const response = await axios.put(API_URL + id, recoveryData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Erreur lors de la mise à jour du recouvrement."
    );
  }
};

// Supprimer un paiement (token nécessaire)
const deleteRecovery = async (id) => {
  const token = getToken();
  if (!token) throw new Error("Utilisateur non authentifié.");

  try {
    const response = await axios.delete(API_URL + id);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      "Erreur lors de la suppression du recouvrement."
    );
  }
};

const recoveryService = {
  createRecovery,
  getRecoveries,
  getRecoveryById,
  updateRecovery,
  deleteRecovery,
};

export default recoveryService;
