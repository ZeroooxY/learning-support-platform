const express = require('express');
const router = express.Router();
const {
    getMaterials,
    getMaterialById,
    createMaterial,
    deleteMaterial,
    getSubMaterial,
    updateMaterial,
    toggleSaveMaterial,
    getSavedMaterials,
    getDeletedMaterials,
    restoreMaterial
} = require('../controllers/materialController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.route('/').get(protect, getMaterials).post(protect, adminOnly, createMaterial);
router.route('/saved').get(protect, getSavedMaterials);
router.route('/deleted').get(protect, adminOnly, getDeletedMaterials);
router.route('/:id').get(protect, getMaterialById).delete(protect, adminOnly, deleteMaterial).put(protect, adminOnly, updateMaterial);
router.route('/:id/restore').put(protect, adminOnly, restoreMaterial);
router.route('/:id/sub/:subId').get(protect, getSubMaterial);
router.route('/save/:id').post(protect, toggleSaveMaterial);

module.exports = router;
