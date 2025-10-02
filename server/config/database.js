const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Les options suivantes sont recommandées pour éviter les avertissements de dépréciation
      // useNewUrlParser: true,  // Déprécié, maintenant la valeur par défaut
      // useUnifiedTopology: true, // Déprécié, maintenant la valeur par défaut
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Arrête l'application en cas d'échec de connexion
  }
};

module.exports = connectDB;