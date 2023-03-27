const express = require('express');
const MediaController = require('../Controllers/mediaController');

const router = express.Router();
const mediaController = new MediaController();

router.post('/:user', mediaController.create);
router.put('/:id', mediaController.update);
router.get('/', mediaController.getAll);
router.get('/:user', mediaController.getByUserId);
router.delete('/:id', mediaController.delete);

module.exports = router;