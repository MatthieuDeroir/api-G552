const express = require('express');
const ScoringBadmintonController = require('../../Controllers/Scoring/badmintonController');

const router = express.Router();
const scoringBadmintonController = new ScoringBadmintonController();

router.post('/:user/:id', scoringBadmintonController.create);
router.put('/:id', scoringBadmintonController.updateScoreById);
router.get('/', scoringBadmintonController.getAll);
router.get('/:id', scoringBadmintonController.getScoreById);
router.delete('/:id', scoringBadmintonController.deleteScoreById);

module.exports = router;
