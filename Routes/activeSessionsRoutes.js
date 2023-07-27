const express = require('express');
const ActiveSessionController = require('../Controllers/activeSessionController');

const router = express.Router();
const activeSessionController = new ActiveSessionController();

router.post('/', activeSessionController.create);
router.put('/:userId', activeSessionController.update);
router.get('/', activeSessionController.getAll);
router.get('/:userId', activeSessionController.getByUserId);
router.delete('/:userId', activeSessionController.delete);

module.exports = router;
