const router = require('express').Router();
const responsesController = require('../controllers/responses.controller');
const { authenticate, authorize } = require('../middleware');

router.post('/forms/:id/responses', responsesController.submit);
router.get('/forms/:id/responses', authenticate, authorize('admin'), responsesController.getByForm);
router.get('/responses/:id', authenticate, authorize('admin'), responsesController.getById);

module.exports = router;
