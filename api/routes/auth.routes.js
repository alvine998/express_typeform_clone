const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware');

router.post('/login', authController.login);
router.post('/logout', authenticate, (req, res) => res.json({ success: true, message: 'Logged out' }));
router.get('/me', authenticate, authController.getMe);

module.exports = router;
