const mongoose = require("mongoose");

const recoverySchema = mongoose.Schema(
  {
    kompassId: {
      type: String,
      required: [true, "Le KOMPASS ID de l'entreprise est requis"],
      trim: true,
    },
    clientName: {
      type: String,
      required: [true, "Le nom du client est requis"],
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: [true, "La méthode de paiement est requise"],
      enum: ["Cash", "Bank Transfer", "Check", "Mobile Money"],
    },
    bankName: {
      type: String,
      required: [true, "Le nom de la banque est requis"],
      trim: true,
    },
    editionYear: {
      type: String,
      required: [true, "L'année d'édition est requise"],
    },
    invoiceDate: {
      type: Date,
      required: false,
    },
    isFullPayment: {
      type: Boolean,
      required: [true, "Indiquer si le paiement est total est requis"],
      default: false,
    },
    amountDue: {
      type: Number,
      required: [true, "Le montant dû est requis"],
      min: 0,
    },
    amountPaid: {
      type: Number,
      required: [true, "Le montant payé est requis"],
      min: 0,
    },
    paymentTotalAmount: {
      type: Number,
      required: false,
      min: 0,
    },
    agentName: {
      type: String,
      required: [true, "Le nom de l'agent est requis"],
      trim: true,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Recovery = mongoose.model("Recovery", recoverySchema);

module.exports = Recovery;
