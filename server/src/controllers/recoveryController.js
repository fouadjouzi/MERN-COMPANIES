const Recovery = require("../models/Recovery");

const createRecovery = async (req, res, next) => {
  try {
    const {
      kompassId,
      clientName,
      paymentMethod,
      bankName,
      editionYear,
      invoiceDate,
      isFullPayment,
      amountDue,
      amountPaid,
      paymentTotalAmount,
      agentName,
      paymentDate,
    } = req.body;

    if (
      !kompassId ||
      !clientName ||
      !paymentMethod ||
      !bankName ||
      !editionYear || // <-- Nouvelle validation
      isFullPayment === undefined ||
      !amountDue ||
      !amountPaid ||
      !agentName
    ) {
      res.status(400);
      throw new Error("Veuillez remplir tous les champs obligatoires.");
    }

    const recovery = await Recovery.create({
      kompassId,
      clientName,
      paymentMethod,
      bankName,
      editionYear,
      invoiceDate,
      isFullPayment,
      amountDue,
      amountPaid,
      paymentTotalAmount,
      agentName,
      paymentDate,
    });

    res.status(201).json(recovery);
  } catch (error) {
    next(error);
  }
};

const getRecoveries = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.kompassId) {
      filter.kompassId = req.query.kompassId;
    }
    const recoveries = await Recovery.find(filter);
    res.status(200).json(recoveries);
  } catch (error) {
    next(error);
  }
};

const getRecoveryById = async (req, res, next) => {
  try {
    const recovery = await Recovery.findById(req.params.id);

    if (!recovery) {
      res.status(404);
      throw new Error("Paiement de recouvrement non trouvé");
    }

    res.status(200).json(recovery);
  } catch (error) {
    if (error.name === "CastError") {
      res.status(400);
      error.message = "ID de paiement de recouvrement invalide";
    }
    next(error);
  }
};

const updateRecovery = async (req, res, next) => {
  try {
    const {
      kompassId,
      clientName,
      paymentMethod,
      bankName,
      editionYear,
      invoiceDate,
      isFullPayment,
      amountDue,
      amountPaid,
      paymentTotalAmount,
      agentName,
      paymentDate,
    } = req.body;

    const recovery = await Recovery.findById(req.params.id);

    if (!recovery) {
      res.status(404);
      throw new Error("Paiement de recouvrement non trouvé");
    }

    recovery.kompassId = kompassId || recovery.kompassId;
    recovery.clientName = clientName || recovery.clientName;
    recovery.paymentMethod = paymentMethod || recovery.paymentMethod;
    recovery.bankName = bankName || recovery.bankName;
    recovery.editionYear = editionYear || recovery.editionYear; // <-- Nouvelle mise à jour
    recovery.invoiceDate = invoiceDate || recovery.invoiceDate; // <-- Nouvelle mise à jour
    recovery.isFullPayment =
      isFullPayment !== undefined ? isFullPayment : recovery.isFullPayment;
    recovery.amountDue = amountDue || recovery.amountDue;
    recovery.amountPaid = amountPaid || recovery.amountPaid;
    recovery.paymentTotalAmount =
      paymentTotalAmount || recovery.paymentTotalAmount; // <-- Nouvelle mise à jour
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

const deleteRecovery = async (req, res, next) => {
  try {
    const recovery = await Recovery.findById(req.params.id);

    if (!recovery) {
      res.status(404);
      throw new Error("Paiement de recouvrement non trouvé");
    }

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
  getRecoveryById,
  updateRecovery,
  deleteRecovery,
};
