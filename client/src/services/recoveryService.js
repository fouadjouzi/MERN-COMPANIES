import axios from 'axios';

// URL de base de votre API de recouvrement backend
const API_URL = 'http://localhost:5000/api/recoveries/';

// Fonction pour obtenir le token de l l'utilisateur depuis le localStorage
// (qui est mis là par AuthContext/authService)
const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
};

// Fonction pour créer un nouveau paiement de recouvrement
const createRecovery = async (recoveryData) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // L'intercepteur Axios dans AuthContext.js gère déjà l'ajout du token
      // mais cette approche est plus explicite si vous vouliez un contrôle fin ici.
      // Pour nos besoins actuels, l'intercepteur suffit, mais c'est pour la démonstration.
      // 'Authorization': token ? `Bearer ${token}` : ''
    },
  };
  // L'intercepteur Axios va ajouter le token si l'utilisateur est connecté.
  const response = await axios.post(API_URL, recoveryData, config);
  return response.data;
};

// Fonction pour obtenir tous les paiements de recouvrement
const getRecoveries = async (kompassId = null) => {
  let url = API_URL;
  if (kompassId) {
    url += `?kompassId=${kompassId}`; // Ajoute le filtre par kompassId si fourni
  }
  const response = await axios.get(url); // Pas besoin de token pour cette route (publique)
  return response.data;
};

// Fonction pour obtenir un paiement de recouvrement par son ID MongoDB
const getRecoveryById = async (id) => {
  const response = await axios.get(API_URL + id); // Pas besoin de token pour cette route (publique)
  return response.data;
};

// Fonction pour mettre à jour un paiement de recouvrement (nécessite token admin)
const updateRecovery = async (id, recoveryData) => {
  const token = getToken(); // Token nécessaire pour cette route protégée
  if (!token) throw new Error("No token found for update operation. User not authenticated.");

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` // L'intercepteur ajoute déjà ceci
    },
  };
  const response = await axios.put(API_URL + id, recoveryData, config);
  return response.data;
};

// Fonction pour supprimer un paiement de recouvrement (nécessite token admin)
const deleteRecovery = async (id) => {
  const token = getToken(); // Token nécessaire pour cette route protégée
  if (!token) throw new Error("No token found for delete operation. User not authenticated.");

  const config = {
    headers: {
      // 'Authorization': `Bearer ${token}` // L'intercepteur ajoute déjà ceci
    },
  };
  const response = await axios.delete(API_URL + id, config);
  return response.data;
};

const recoveryService = {
  createRecovery,
  getRecoveries,
  getRecoveryById,
  updateRecovery,
  deleteRecovery,
};

export default recoveryService;