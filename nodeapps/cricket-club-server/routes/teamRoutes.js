const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const teamController = require('../controllers/teamController');
const auth = require('../middleware/auth');

// Setup multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/teams'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Add team route with file upload + validators
router.post(
    '/addteam',
    auth,
    upload.single('logo'), // ✅ This parses form-data
    [
        body('name').notEmpty().withMessage('Team name is required'),
        body('shortname').notEmpty().withMessage('Short name is required'),
        body('place').notEmpty().withMessage('Team location is required'),
    ],
    teamController.addTeam
);

module.exports = router;
