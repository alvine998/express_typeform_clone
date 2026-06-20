const router = require('express').Router();
const notificationsController = require('../controllers/notifications.controller');
const { authenticate } = require('../middleware');

router.use(authenticate);

router.put('/read-all', notificationsController.markAllAsRead);
router.get('/', notificationsController.list);
router.put('/:id/read', notificationsController.markAsRead);

module.exports = router;
