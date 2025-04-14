const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const playerController = require('../controllers/playerController');

router.post(
    '/addplayer',
    auth,
    playerController.uploadphoto,
    [
        body('team_id').notEmpty().withMessage('Team ID is required'),
        body('player_name').notEmpty().withMessage('Player name is required'),
        body('player_role').notEmpty().withMessage('Player role is required')
    ],
    playerController.addPlayer
);

router.put(
    '/updateplayer/:id',
    auth,
    playerController.uploadphoto,
    playerController.updatePlayer
);

router.get('/getplayers/:teamid', auth, playerController.getPlayersByTeam);

router.get('/getplayers', auth, playerController.getPlayers);

router.delete('/deleteplayer/:id', auth, playerController.deletePlayer);

module.exports = router;
