const express = require('express');
const EventMediaController = require('../Controllers/eventmediaController');

const router = express.Router();
const eventMediaController = new EventMediaController();

router.post('/', eventMediaController.create);
router.delete('/:id', eventMediaController.delete);
router.delete('/media/:mediaId', eventMediaController.deleteAllByMedia);
router.get('/media/:mediaId', eventMediaController.getAllByMedia);
router.get('/event/:eventId', eventMediaController.getAllByEvent);
router.get('/event/:eventId', eventMediaController.deleteAllByMedia);

module.exports = router;