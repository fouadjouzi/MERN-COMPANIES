import React from "react";
import { useTheme } from "../context/ThemeContext";

// Ces styles JS ne sont plus nécessaires pour gérer le HOVER
// Ils définissent seulement les styles initiaux du bouton
const toggleStyles = {
  button: {
    padding: "8px 15px",
    backgroundColor: "var(--secondary-button-bg)",
    color: "var(--secondary-button-text)",
    border: "1px solid var(--border-color)",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    // La transition est déjà définie dans index.css pour tous les boutons
    // transition: 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
  },
};

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={toggleStyles.button}
      // SUPPRIMEZ CES LIGNES :
      // onMouseOver={(e) => e.currentTarget.style.backgroundColor = toggleStyles.buttonHover.backgroundColor}
      // onMouseOut={(e) => e.currentTarget.style.backgroundColor = toggleStyles.button.backgroundColor}
    >
      Basculer vers le mode {theme === "light" ? "Sombre" : "Clair"}
    </button>
  );
}

export default ThemeToggle;
