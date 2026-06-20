const router = require('express').Router();
const formsController = require('../controllers/forms.controller');
const { authenticate, authorize } = require('../middleware');

router.get('/', authenticate, formsController.list);
router.get('/:id', authenticate, formsController.getById);
router.post('/', authenticate, authorize('admin'), formsController.create);
router.put('/:id', authenticate, authorize('admin'), formsController.update);
router.delete('/:id', authenticate, authorize('admin'), formsController.remove);
router.post('/:id/duplicate', authenticate, authorize('admin'), formsController.duplicate);
router.get('/:id/report', authenticate, authorize('admin'), formsController.report);
router.get('/:id/surveyors', authenticate, authorize('admin'), formsController.surveyors);

module.exports = router;
