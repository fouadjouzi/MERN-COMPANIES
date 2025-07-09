require("dotenv").config();
const express = require("express");
const connectDB = require("./src/configdb");
const recoveryRoutes = require("./src/routes/recoveryRoutes");
const { notFound, errorHandler } = require("/src/middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Connecter à la base de données MongoDB
connectDB();

// Middleware pour parser le JSON dans les requêtes
app.use(express.json());

// Routes de l'API
app.use("/api/recoveries", recoveryRoutes);

// Middlewares pour gérer les erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
