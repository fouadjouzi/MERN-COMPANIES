import axios from 'axios';

// URL de base de votre API d'authentification backend
const API_URL = 'http://localhost:5000/api/auth/';

// Fonction pour enregistrer un utilisateur
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);

  // Si l'enregistrement réussit, stockez l'utilisateur et le token dans le localStorage
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Fonction pour connecter un utilisateur
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  // Si la connexion réussit, stockez l'utilisateur et le token dans le localStorage
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Fonction pour déconnecter un utilisateur
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;