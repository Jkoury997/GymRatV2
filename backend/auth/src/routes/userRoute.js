const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken} = require('../middlewares/authMiddleware');

// 🧍 Obtener usuario autenticado
router.get('/me', verifyToken, userController.getUserInfo);

// 🔍 Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// 🔍 Obtener usuario por ID
router.get('/:id', userController.getUserById);

// 🔍 Obtener usuario por email
router.get('/email/:email', userController.getUserByEmail);

// ✏️ Actualizar usuario por ID
router.put('/',verifyToken, userController.updateUser);

// ❌ Eliminar usuario por ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
