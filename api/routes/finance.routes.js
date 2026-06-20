const router = require('express').Router();
const financeController = require('../controllers/finance.controller');
const { authenticate, authorize } = require('../middleware');

router.use(authenticate, authorize('admin'));

router.get('/', financeController.list);
router.get('/:id', financeController.getById);
router.put('/:id', financeController.update);
router.put('/:id/approve', financeController.approve);
router.put('/:id/reject', financeController.reject);

module.exports = router;
