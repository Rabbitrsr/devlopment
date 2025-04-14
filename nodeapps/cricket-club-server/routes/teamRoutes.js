const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const teamController = require('../controllers/teamController');
const auth = require('../middleware/auth');


// Add team route with file upload + validators
router.post(
    '/addteam',
    auth,
    teamController.uploadlogo,
    [
        body('name').notEmpty().withMessage('Team name is required'),
        body('shortname').notEmpty().withMessage('Short name is required'),
        body('place').notEmpty().withMessage('Team location is required'),
    ],
    teamController.addTeam
);

router.put(
    '/update/:id',
    auth,
    teamController.uploadlogo, // re-use the same multer config as add
    [
        body('name').notEmpty().withMessage('Team name is required'),
        body('shortname').notEmpty().withMessage('Short name is required'),
        body('place').notEmpty().withMessage('Place is required')
    ],
    teamController.updateTeam
);

router.get('/getteams', auth, teamController.getTeams);


router.delete('/delete/:id', auth, teamController.deleteTeam);


module.exports = router;
