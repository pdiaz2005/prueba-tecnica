'use strict';

const { crearTarea, listarTareas, cambiarEstado, obtenerResumen } = require('../services/tareasService');
const { validateCrearTarea, validateCambiarEstado, validateResumen } = require('../validators/tareaValidator');

/**
 * POST /tareas
 * Validates the request body with joi, delegates to the service, and responds HTTP 201.
 */
const crearTareaHandler = [
  validateCrearTarea,
  async (req, res, next) => {
    try {
      const tarea = await crearTarea(req.body);
      res.status(201).json(tarea);
    } catch (err) {
      next(err);
    }
  },
];

/**
 * GET /tareas
 * Reads optional query params, delegates to the service, responds with data + meta.
 */
const listarTareasHandler = async (req, res, next) => {
  try {
    const { estado, responsable, desde, hasta, page, limit } = req.query;
    const result = await listarTareas({ estado, responsable, desde, hasta, page, limit });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /tareas/:id/estado
 * Validates the request body with joi, delegates to the service, responds HTTP 200.
 */
const cambiarEstadoHandler = [
  validateCambiarEstado,
  async (req, res, next) => {
    try {
      const tarea = await cambiarEstado(req.params.id, req.body.estado);
      res.status(200).json(tarea);
    } catch (err) {
      next(err);
    }
  },
];

/**
 * GET /tareas/resumen
 * Validates the responsable query param with joi, delegates to the service, responds HTTP 200.
 */
const obtenerResumenHandler = [
  validateResumen,
  async (req, res, next) => {
    try {
      const result = await obtenerResumen(req.query.responsable);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
];

module.exports = { crearTareaHandler, listarTareasHandler, cambiarEstadoHandler, obtenerResumenHandler };
