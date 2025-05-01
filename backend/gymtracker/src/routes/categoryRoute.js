const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/authMiddleware');
const role = require("../middlewares/roleMiddleware")

// Solo usuarios con roles especiales pueden crear/editar/eliminar
router.post('/', auth, role('admin'), categoryController.createCategory);
router.put('/:id', auth, role('admin'), categoryController.updateCategory);
router.delete('/:id', auth, role('admin'), categoryController.deleteCategory);

// Público (opcional)
router.get('/', categoryController.getCategories);

module.exports = router;
