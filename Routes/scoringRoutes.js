const express = require('express');
const ScoringController = require('../Controllers/scoringController');

const router = express.Router();
const scoringController = new ScoringController();

router.post('/', scoringController.create);
router.put('/:id', scoringController.update);
router.get('/', scoringController.getAll);
router.get('/:id', scoringController.getById);
router.get('/user/:userId', scoringController.getByUserId);
router.delete('/:id', scoringController.delete);

module.exports = router;
