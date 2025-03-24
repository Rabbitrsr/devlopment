const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { body } = require('express-validator');


// ✅ Add login route:
router.post(
    '/login',
    [
        body('email').isEmail(),
        body('password').notEmpty()
    ],
    adminController.loginUser
);

module.exports = router;
