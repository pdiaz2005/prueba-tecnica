'use strict';

const Joi = require('joi');

const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA'];
const ESTADOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'];

// POST /tareas
const crearTareaSchema = Joi.object({
  titulo: Joi.string().trim().min(1).required(),
  descripcion: Joi.string().trim().allow('', null).optional(),
  prioridad: Joi.string().valid(...PRIORIDADES).required(),
  idResponsable: Joi.number().integer().positive().required(),
  fechaLimite: Joi.date().greater('now').required(),
});

// PATCH /tareas/:id/estado
const cambiarEstadoSchema = Joi.object({
  estado: Joi.string().valid(...ESTADOS).required(),
});

// GET /tareas/resumen
const resumenSchema = Joi.object({
  responsable: Joi.number().integer().positive().required(),
}).unknown(true); // allow other query params to pass through

/**
 * Returns an Express middleware that validates req.body against the given schema.
 */
const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next({ statusCode: 422, message: 'Validation error', details: error.details.map((d) => d.message) });
  }
  req.body = value;
  next();
};

/**
 * Returns an Express middleware that validates req.query against the given schema.
 */
const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, { abortEarly: false });
  if (error) {
    return next({ statusCode: 422, message: 'Validation error', details: error.details.map((d) => d.message) });
  }
  req.query = value;
  next();
};

module.exports = {
  validateCrearTarea: validateBody(crearTareaSchema),
  validateCambiarEstado: validateBody(cambiarEstadoSchema),
  validateResumen: validateQuery(resumenSchema),
};
