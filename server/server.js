require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/database.js");
const recoveryRoutes = require("./src/routes/recoveryRoutes");
const authRoutes = require("./src/routes/authRoutes");
const { notFound, errorHandler } = require("./src/middleware/errorHandler");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Connecter à la base de données MongoDB
connectDB();

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// **TRÈS IMPORTANT : PLACEZ CORS ICI, AVANT TOUTES LES ROUTES**
app.use(cors()); // Assurez-vous que cette ligne est présente et activée

// Routes de l'API
app.use("/api/recoveries", recoveryRoutes);
app.use("/api/auth", authRoutes);

// Middlewares pour gérer les erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
