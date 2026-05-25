'use strict';

const { Router } = require('express');
const {
  crearTareaHandler,
  listarTareasHandler,
  cambiarEstadoHandler,
  obtenerResumenHandler,
} = require('../controllers/tareasController');

const router = Router();

// GET /tareas/resumen must be registered before GET /tareas/:id to avoid
// Express matching "resumen" as an :id parameter.
router.get('/resumen', obtenerResumenHandler);

router.post('/', crearTareaHandler);
router.get('/', listarTareasHandler);
router.patch('/:id/estado', cambiarEstadoHandler);

module.exports = router;
