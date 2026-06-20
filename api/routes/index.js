const router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/users', require('./users.routes'));
router.use('/forms', require('./forms.routes'));
router.use('/', require('./responses.routes'));
router.use('/dashboard', require('./dashboard.routes'));
router.use('/activity-logs', require('./activityLogs.routes'));
router.use('/finance', require('./finance.routes'));
router.use('/notifications', require('./notifications.routes'));

module.exports = router;
