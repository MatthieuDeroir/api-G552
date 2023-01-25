const express = require('express');
const UserController = require('../Controllers/userController');

const router = express.Router();
const userController = new UserController();

router.post('/', userController.create);
router.put('/:id', userController.update);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.delete('/:id', userController.delete);

module.exports = router;