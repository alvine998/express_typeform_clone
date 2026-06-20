const router = require('express').Router();
const usersController = require('../controllers/users.controller');
const { authenticate, authorize } = require('../middleware');

router.use(authenticate, authorize('admin'));

router.get('/', usersController.list);
router.get('/:id', usersController.getById);
router.post('/', usersController.create);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.remove);

module.exports = router;
