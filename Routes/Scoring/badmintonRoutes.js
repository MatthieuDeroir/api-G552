const express = require('express');
const ScoringBadmintonController = require('../../Controllers/Scoring/badmintonController');

const router = express.Router();
const scoringBadmintonController = new ScoringBadmintonController();

router.put('/', scoringBadmintonController.updateScore);
router.get('/', scoringBadmintonController.getAll);
router.get('/:id', scoringBadmintonController.getScoreById);
router.delete('/:id', scoringBadmintonController.deleteScoreById);

module.exports = router;
