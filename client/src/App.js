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
import EditRecoveryPage from "./pages/EditRecoveryPage";
import CompanyDashboard from "./pages/CompanyDashboard"; // <-- AJOUTÉ
import RecoveryDetailPage from "./pages/RecoveryDetailPage"; // <-- AJOUTÉ

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
      <AuthProvider>
        <ThemeProvider>
          <div className="App">
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
                    Accueil & Liste
                  </Link>
                </li>
                <li style={{ margin: "0 15px" }}>
                  <Link to="/login" style={{ color: "var(--link-color)" }}>
                    Connexion
                  </Link>
                </li>
                <li style={{ margin: "0 15px" }}>
                  <Link to="/register" style={{ color: "var(--link-color)" }}>
                    Inscription (Admin)
                  </Link>
                </li>
                <li style={{ margin: "0 15px" }}>
                  <Link to="/admin" style={{ color: "var(--link-color)" }}>
                    Admin Dashboard
                  </Link>
                </li>
              </ul>
              {/* Le bouton de basculement du thème */}
              <ThemeToggle />
            </nav>
            {/* Définition des Routes de l'application */}
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<HomePage />} />
              {/* Routes d'authentification */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              {/* ROUTE DÉDIÉE AU DASHBOARD ENTREPRISE (Regroupe par KOMPASS ID) */}
              <Route
                path="/company/:kompassId"
                element={<CompanyDashboard />}
              />{" "}
              {/* <-- NOUVEAU */}
              {/* ROUTE DÉTAIL PAIEMENT (Affiche un seul paiement complet) */}
              <Route
                path="/recovery/:id"
                element={<RecoveryDetailPage />}
              />{" "}
              {/* <-- NOUVEAU */}
              {/* Routes protégées (Admin Only) */}
              <Route
                path="/register"
                element={
                  <PrivateRoute requiredRole="admin">
                    <RegisterPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute requiredRole="admin">
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
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
