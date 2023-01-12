const express = require('express');
const EventMediaController = require('../controllers/eventmediaController');

const router = express.Router();
const eventMediaController = new EventMediaController();

router.post('/', eventMediaController.create);
router.put('/:id', eventMediaController.update);
router.get('/', eventMediaController.getAll);
router.get('/:id', eventMediaController.getById);
router.delete('/:id', eventMediaController.delete);
router.get('/media/:mediaId', eventMediaController.getAllByMedia);
router.post('/:eventId/media/:mediaId', eventMediaController.addMedia);
router.delete('/:eventId/media/:mediaId', eventMediaController.removeMedia);

module.exports = router;