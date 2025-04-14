const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { body } = require('express-validator');
const auth = require('../middleware/auth');

router.post(
  '/register',
    [
        body('email').isEmail(),
        body('password').notEmpty()
    ],
    adminController.registerUser
);

// ✅ Add login route:
router.post(
    '/login',
    [
        body('email').isEmail(),
        body('password').notEmpty()
    ],
    adminController.loginUser
);

// ✅ Add login route:
router.post(
    '/update/:id',
    auth,
    adminController.updateUser
);

// ✅ Add login route:
router.get(
    '/details/:id',
    auth,
    adminController.getUserDetails
);

module.exports = router;
