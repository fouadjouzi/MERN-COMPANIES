const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Pour le hachage des mots de passe

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Le nom d'utilisateur est requis"],
      unique: true, // Chaque nom d'utilisateur doit être unique
      trim: true,
      lowercase: true, // Stocke les noms d'utilisateur en minuscules
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
    },
    role: {
      type: String,
      enum: ["public", "admin"], // Les rôles possibles
      default: "public", // Rôle par défaut si non spécifié
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt
  }
);

// Middleware Mongoose pour hacher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre("save", async function (next) {
  // 'this' fait référence au document utilisateur actuel
  if (!this.isModified("password")) {
    // Vérifie si le mot de passe a été modifié (ou est nouveau)
    next(); // Si non, passe au middleware suivant
  }
  const salt = await bcrypt.genSalt(10); // Génère un "sel" pour le hachage
  this.password = await bcrypt.hash(this.password, salt); // Hache le mot de passe
  next();
});

// Méthode pour comparer le mot de passe saisi avec le mot de passe haché
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
