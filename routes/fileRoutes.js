const express = require('express');
const MediaController = require('../controllers/fileController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();
const fileController = new FileController();

router.post('/', upload.single('file'), fileController.create);
router.put('/:id', fileController.update);
router.get('/', fileController.getAll);
router.get('/:id', fileController.getById);
router.delete('/:id', fileController.delete);

module.exports = router;