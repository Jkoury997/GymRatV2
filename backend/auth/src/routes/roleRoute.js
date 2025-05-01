const express = require('express');
const roleController = require('../controllers/roleController');

const router = express.Router();

// Endpoint para asignar o actualizar el rol de un usuario en una empresa.
router.post('/assign', roleController.assignRole);

// Endpoint para obtener los roles asignados a un usuario.
router.get('/user/:userId', roleController.getRolesByUserId);

module.exports = router;
