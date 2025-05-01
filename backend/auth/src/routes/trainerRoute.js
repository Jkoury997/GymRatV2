
const express = require('express');
const { linkTrainer, getStudents,unlinkTrainer } = require('../controllers/trainerController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { createTrainerLinkCode, getTrainerLinkCode } = require('../controllers/trainerLinkCodeController');

const router = express.Router();
// Endpoint para que un alumno se vincule a un entrenador mediante el código
router.post('/link-trainer', verifyToken, linkTrainer);

router.post('/unlink-trainer', verifyToken, unlinkTrainer);

// Endpoint para que un entrenador obtenga la lista de sus alumnos
router.get('/students', verifyToken, getStudents);


// Ruta para que el entrenador genere o regenere su código de vinculación
router.get('/link-create', verifyToken, createTrainerLinkCode);

// Ruta para que el entrenador pueda ver su código de vinculación
router.get('/', verifyToken, getTrainerLinkCode);

module.exports = router;
