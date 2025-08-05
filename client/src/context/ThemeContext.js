import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Création du Contexte de Thème
const ThemeContext = createContext(null);

// 2. Création du Fournisseur de Contexte (ThemeProvider)
export const ThemeProvider = ({ children }) => {
  // État pour stocker le thème actuel ('light' ou 'dark')
  // Initialise l'état en vérifiant le localStorage pour le thème préféré de l'utilisateur
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light"; // Thème clair par défaut si rien n'est stocké
  });

  // 3. Effet pour appliquer la classe CSS au body et sauvegarder la préférence
  useEffect(() => {
    const body = document.body;
    if (theme === "dark") {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
    localStorage.setItem("theme", theme); // Sauvegarde le thème préféré
  }, [theme]); // Cet effet s'exécute chaque fois que 'theme' change

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Les valeurs qui seront disponibles pour les composants qui utilisent ce contexte
  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// 3. Hook personnalisé pour utiliser le contexte de thème
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useTheme doit être utilisé à l'intérieur d'un ThemeProvider"
    );
  }
  return context;
};
