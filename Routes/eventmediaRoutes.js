const express = require('express');
const EventMediaController = require('../Controllers/eventmediaController');

const router = express.Router();
const eventMediaController = new EventMediaController();

router.post('/', eventMediaController.create);
router.delete('/:id', eventMediaController.delete);
router.get('/media/:mediaId', eventMediaController.getAllByMedia);
router.get('/event/:eventId', eventMediaController.getAllByEvent);

module.exports = router;