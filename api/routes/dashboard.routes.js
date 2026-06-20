const router = require('express').Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate, authorize } = require('../middleware');

router.get('/stats', authenticate, authorize('admin'), dashboardController.getStats);
router.get('/charts', authenticate, authorize('admin'), dashboardController.getCharts);

module.exports = router;
