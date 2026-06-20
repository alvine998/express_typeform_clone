const router = require('express').Router();
const activityLogsController = require('../controllers/activityLogs.controller');
const { authenticate, authorize } = require('../middleware');

router.get('/', authenticate, authorize('admin'), activityLogsController.list);
router.post('/', authenticate, activityLogsController.create);

module.exports = router;
