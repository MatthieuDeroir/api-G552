const express = require('express');
const multer = require('multer');
const FileController = require('../Controllers/fileController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const fileController = new FileController();

router.post('/', upload.single('file'), fileController.create);
router.put('/:id', fileController.update);
router.get('/', fileController.getAll);
router.get('/:id', fileController.getById);
router.delete('/:id', fileController.delete);

module.exports = router;
