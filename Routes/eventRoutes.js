const express = require('express');
const EventController = require('../Controllers/eventController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();
const eventController = new EventController();

router.post('/', upload.single('file'), eventController.create);
router.put('/:id', eventController.update);
router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);
router.delete('/:id', eventController.delete);

module.exports = router;