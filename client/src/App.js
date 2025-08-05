import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Importations des Contextes
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Importations des Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import EditRecoveryPage from "./pages/EditRecoveryPage"; // Pour la modification d'un paiement

// Importations des Composants de Route Protégée/Publique
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

// Importation du composant de basculement du thème
import ThemeToggle from "./components/ThemeToggle";

// Importation des styles globaux (où sont définies les variables CSS pour le thème)
import "./App.css";

function App() {
  return (
    <Router>
      {/* AuthProvider doit envelopper toute l'application pour que le contexte d'authentification soit disponible partout */}
      <AuthProvider>
        {/* ThemeProvider doit envelopper le contenu de l'application (ou AuthProvider) pour appliquer le thème */}
        {/* Il est placé ici pour que même la navigation puisse utiliser les variables de thème */}
        <ThemeProvider>
          <div className="App">
            {" "}
            {/* La div principale de l'application, pour appliquer des styles généraux si nécessaire */}
            {/* Barre de navigation */}
            <nav
              style={{
                padding: "10px",
                background: "var(--card-background)", // Utilise la variable CSS pour le fond
                borderBottom: "1px solid var(--border-color)", // Utilise la variable CSS pour la bordure
                marginBottom: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                }}
              >
                <li style={{ margin: "0 15px" }}>
                  <Link to="/" style={{ color: "var(--link-color)" }}>
                    Accueil (Public)
                  </Link>{" "}
                  {/* Utilise la variable CSS pour la couleur des liens */}
                </li>
                <li style={{ margin: "0 15px" }}>
                  <Link to="/login" style={{ color: "var(--link-color)" }}>
                    Connexion
                  </Link>
                </li>
                <li style={{ margin: "0 15px" }}>
                  <Link to="/register" style={{ color: "var(--link-color)" }}>
                    Inscription (Admin-Only)
                  </Link>
                </li>
                <li style={{ margin: "0 15px" }}>
                  <Link to="/admin" style={{ color: "var(--link-color)" }}>
                    Admin (Protégé)
                  </Link>
                </li>
              </ul>
              {/* Le bouton de basculement du thème */}
              <ThemeToggle />
            </nav>
            {/* Définition des Routes de l'application */}
            <Routes>
              {/* Routes publiques (accessibles à tous, qu'ils soient connectés ou non) */}
              <Route path="/" element={<HomePage />} />

              {/* Routes d'authentification (accessibles SEULEMENT si PAS connecté, redirige si déjà connecté) */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />

              {/* Routes protégées (accessibles SEULEMENT si l'utilisateur est authentifié et a le rôle requis) */}
              {/* Inscription est maintenant protégée pour les admins, car ils gèrent la création de nouveaux utilisateurs */}
              <Route
                path="/register"
                element={
                  <PrivateRoute requiredRole="admin">
                    <RegisterPage />
                  </PrivateRoute>
                }
              />
              {/* Le tableau de bord Admin est également protégé pour les admins */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              {/* La page d'édition d'un paiement est protégée pour les admins */}
              <Route
                path="/edit/:id"
                element={
                  <PrivateRoute requiredRole="admin">
                    <EditRecoveryPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
