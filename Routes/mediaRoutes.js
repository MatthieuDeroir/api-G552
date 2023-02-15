const express = require('express');
const MediaController = require('../Controllers/mediaController');

const router = express.Router();
const mediaController = new MediaController();

router.post('/', mediaController.create);
router.put('/:id', mediaController.update);
router.get('/', mediaController.getAll);
router.get('/:id', mediaController.getById);
router.delete('/:id', mediaController.delete);
// router.get('/user/:id', mediaController.getByUser);

module.exports = router;