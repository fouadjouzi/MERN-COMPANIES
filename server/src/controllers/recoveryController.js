const Recovery = require("../models/Recovery");

// @desc    Créer un nouveau paiement de recouvrement
// @route   POST /api/recoveries
// @access  Public
const createRecovery = async (req, res, next) => {
  try {
    // kompassId est maintenant l'ID de l'entreprise
    console.log("Données reçues par le backend:", req.body);
    const {
      kompassId,
      clientName,
      paymentMethod,
      bankName,
      isFullPayment,
      amountDue,
      amountPaid,
      agentName,
      paymentDate,
    } = req.body;

    // Validation des champs requis
    if (
      !kompassId ||
      !clientName ||
      !paymentMethod ||
      !bankName ||
      isFullPayment === undefined ||
      !amountDue ||
      !amountPaid ||
      !agentName
    ) {
      res.status(400);
      throw new Error("Veuillez remplir tous les champs obligatoires.");
    }

    // Plus de vérification d'unicité pour kompassId ici, car c'est un ID d'entreprise, pas un ID de document unique.

    // Créer un nouveau document de recouvrement
    const recovery = await Recovery.create({
      kompassId, // L'ID de l'entreprise auquel ce paiement est lié
      clientName,
      paymentMethod,
      bankName,
      isFullPayment,
      amountDue,
      amountPaid,
      agentName,
      paymentDate,
    });

    res.status(201).json(recovery); // 201 Created
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir tous les paiements de recouvrement
// @route   GET /api/recoveries
// @access  Public
const getRecoveries = async (req, res, next) => {
  try {
    const filter = {};
    // Permettre le filtrage par kompassId (l'ID de l'entreprise)
    if (req.query.kompassId) {
      filter.kompassId = req.query.kompassId;
    }
    const recoveries = await Recovery.find(filter);
    res.status(200).json(recoveries);
  } catch (error) {
    next(error);
  }
};

// @desc    Obtenir un seul paiement de recouvrement par ID (MongoDB _id)
// @route   GET /api/recoveries/:id
// @access  Public
const getRecoveryById = async (req, res, next) => {
  try {
    // Revenir à la recherche par _id de MongoDB
    const recovery = await Recovery.findById(req.params.id);

    if (!recovery) {
      res.status(404);
      throw new Error("Paiement de recouvrement non trouvé");
    }

    res.status(200).json(recovery);
  } catch (error) {
    if (error.name === "CastError") {
      // Gérer l'erreur si l'ID n'est pas un format valide pour _id
      res.status(400);
      error.message = "ID de paiement de recouvrement invalide";
    }
    next(error);
  }
};

// @desc    Mettre à jour un paiement de recouvrement par ID (MongoDB _id)
// @route   PUT /api/recoveries/:id
// @access  Public
const updateRecovery = async (req, res, next) => {
  try {
    // kompassId est inclus dans le corps pour pouvoir être mis à jour, mais pas comme identifiant de la ressource.
    const {
      kompassId,
      clientName,
      paymentMethod,
      bankName,
      isFullPayment,
      amountDue,
      amountPaid,
      agentName,
      paymentDate,
    } = req.body;

    // Trouver le document par son _id de MongoDB
    const recovery = await Recovery.findById(req.params.id);

    if (!recovery) {
      res.status(404);
      throw new Error("Paiement de recouvrement non trouvé");
    }

    // Pas de vérification d'unicité pour kompassId ici.

    // Mettre à jour les champs
    recovery.kompassId = kompassId || recovery.kompassId; // Permettre la modification du kompassId de l'entreprise liée
    recovery.clientName = clientName || recovery.clientName;
    recovery.paymentMethod = paymentMethod || recovery.paymentMethod;
    recovery.bankName = bankName || recovery.bankName;
    recovery.isFullPayment =
      isFullPayment !== undefined ? isFullPayment : recovery.isFullPayment;
    recovery.amountDue = amountDue || recovery.amountDue;
    recovery.amountPaid = amountPaid || recovery.amountPaid;
    recovery.agentName = agentName || recovery.agentName;
    recovery.paymentDate = paymentDate || recovery.paymentDate;

    const updatedRecovery = await recovery.save();

    res.status(200).json(updatedRecovery);
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400);
      error.message = "ID de paiement de recouvrement invalide";
    }
    next(error);
  }
};

// @desc    Supprimer un paiement de recouvrement par ID (MongoDB _id)
// @route   DELETE /api/recoveries/:id
// @access  Public
const deleteRecovery = async (req, res, next) => {
  try {
    // Trouver le document par son _id de MongoDB
    const recovery = await Recovery.findById(req.params.id);

    if (!recovery) {
      res.status(404);
      throw new Error("Paiement de recouvrement non trouvé");
    }

    // Supprimer le document en utilisant le _id
    await Recovery.deleteOne({ _id: req.params.id });

    res
      .status(200)
      .json({ message: "Paiement de recouvrement supprimé avec succès" });
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400);
      error.message = "ID de paiement de recouvrement invalide";
    }
    next(error);
  }
};

module.exports = {
  createRecovery,
  getRecoveries,
  getRecoveryById, // Revenir à l'exportation de getRecoveryById
  updateRecovery,
  deleteRecovery,
};
