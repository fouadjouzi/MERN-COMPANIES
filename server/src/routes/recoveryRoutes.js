const express = require('express');
const router = express.Router();
const {
  createRecovery,
  getRecoveries,
  getRecoveryById,
  updateRecovery,
  deleteRecovery,
} = require('../controllers/recoveryController');

const { protect } = require('../middleware/authMiddleware'); // <-- IMPORTER protect
const { authorizeRoles } = require('../middleware/roleMiddleware'); // <-- IMPORTER authorizeRoles

// Route pour créer un nouveau paiement (accessible à tous, même non authentifiés)
router.post('/', createRecovery);

// Route pour obtenir tous les paiements (accessible à tous, même non authentifiés)
router.get('/', getRecoveries);

// Route pour obtenir un paiement par ID (accessible à tous, même non authentifiés)
router.get('/:id', getRecoveryById);

// Routes pour mettre à jour et supprimer (PROTEGEES : SEULS LES ADMINS AUTHENTIFIES)
router.route('/:id')
  .put(protect, authorizeRoles('admin'), updateRecovery)    // <--- PROTÉGÉ
  .delete(protect, authorizeRoles('admin'), deleteRecovery); // <--- PROTÉGÉ

module.exports = router;