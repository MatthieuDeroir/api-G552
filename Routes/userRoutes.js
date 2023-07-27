const express = require('express');
const UserController = require('../Controllers/userController');

const router = express.Router();
const userController = new UserController();

router.post('/', userController.create);
router.put('/:id', userController.update);
router.post('/changepassword/:id', userController.changePassword);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.delete('/:id', userController.delete);
router.get('/updateFirstLogin/:id', userController.updateFirstLogin);

module.exports = router;