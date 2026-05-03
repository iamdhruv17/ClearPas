const express = require('express');
const router = express.Router();
const medicalLeaveController = require('../controllers/medicalLeaveController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(authenticate);

// Phase 1
router.post('/intimations', authorize(['Student']), medicalLeaveController.createIntimation);

// Phase 2
router.post('/intimations/:id/documents', authorize(['Student']), upload.single('document'), medicalLeaveController.submitDocuments);

module.exports = router;
