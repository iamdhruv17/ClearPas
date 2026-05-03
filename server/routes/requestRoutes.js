const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All request routes require authentication
router.use(authenticate);

// Student creates request
router.post('/', authorize(['Student']), upload.single('document'), requestController.createRequest);

// Anyone can view their requests
router.get('/', requestController.getRequests);

// Authority takes action
router.put('/:id/action', authorize(['Teacher', 'Coordinator', 'Mentor', 'HOD', 'Dean', 'Admin']), requestController.updateRequestAction);

module.exports = router;
