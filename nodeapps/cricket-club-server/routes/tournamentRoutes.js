const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const tournamentController = require('../controllers/tournamentController');

router.post(
    '/addtournament',
    auth,
    [
        body('title').notEmpty(),
        body('place').notEmpty(),
        body('startDate').isISO8601(),
        body('endDate').isISO8601(),
    ],
    tournamentController.addTournament
);

router.put(
    '/update/:id',
    auth,
    tournamentController.uploadBanner, // if sending updated banner
    [
        body('title').notEmpty().withMessage('Tournament title is required'),
        body('place').notEmpty().withMessage('Tournament location is required'),
        body('start_date').notEmpty().withMessage('Start date is required'),
        body('end_date').notEmpty().withMessage('End date is required'),
    ],
    tournamentController.updateTournament
);

router.get('/gettournaments', auth, tournamentController.getTournaments);

router.delete('/delete/:id', auth, tournamentController.deleteTournament);

module.exports = router;