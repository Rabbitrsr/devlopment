const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const auth = require('../middleware/auth'); // Assuming you have an auth middleware

router.post('/addmatch', auth, matchController.addMatch);
router.get('/getmatches', auth, matchController.getMatches);
router.get('/getmatchesfromid/:id', auth, matchController.getMatchFromID);
router.get('/details/:id', auth, matchController.getMatchDetails);
router.get('/getlivematches', auth, matchController.getLiveMatches);
router.get('/setupinningsstate',auth,matchController.setupInningsState)
router.get("/status/:id", auth, matchController.getStatus)
router.put('/update/:id', auth, matchController.updateMatch);
router.delete('/delete/:id', auth, matchController.deleteMatch);

module.exports = router;
