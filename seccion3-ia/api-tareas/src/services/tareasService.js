'use strict';

const { Op } = require('sequelize');
const { Tarea, HistorialEstado, sequelize } = require('../models');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Persists a new task with initial state PENDIENTE.
 * @param {object} data - Validated task fields from the request body.
 * @returns {Promise<Tarea>} The created Tarea instance.
 */
const crearTarea = async (data) => {
  const tarea = await Tarea.create({
    titulo: data.titulo,
    descripcion: data.descripcion ?? null,
    prioridad: data.prioridad,
    idResponsable: data.idResponsable,
    fechaLimite: data.fechaLimite,
    estado: 'PENDIENTE',
  });

  return tarea;
};

/**
 * Returns a paginated list of tasks with optional filters.
 * @param {object} filters - { estado, responsable, desde, hasta, page, limit }
 * @returns {Promise<{ data: Tarea[], meta: { total, page, limit } }>}
 */
const listarTareas = async ({ estado, responsable, desde, hasta, page = 1, limit = 10 } = {}) => {
  const where = {};

  if (estado) {
    where.estado = estado;
  }

  if (responsable) {
    where.idResponsable = responsable;
  }

  if (desde || hasta) {
    where.fechaLimite = {};
    if (desde) where.fechaLimite[Op.gte] = desde;
    if (hasta) where.fechaLimite[Op.lte] = hasta;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 10);
  const offset = (pageNum - 1) * limitNum;

  const { count, rows } = await Tarea.findAndCountAll({
    where,
    limit: limitNum,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return {
    data: rows,
    meta: { total: count, page: pageNum, limit: limitNum },
  };
};

/**
 * Changes a task's state and records the transition in HistorialEstado.
 * Runs both operations inside a single transaction.
 * @param {number} id - Task primary key.
 * @param {string} nuevoEstado - One of PENDIENTE, EN_PROGRESO, COMPLETADA, CANCELADA.
 * @returns {Promise<Tarea>} The updated Tarea instance.
 * @throws {AppError} 404 if no task exists for the given id.
 */
const cambiarEstado = async (id, nuevoEstado) => {
  const tarea = await Tarea.findByPk(id);
  if (!tarea) {
    throw new AppError(`Tarea con id ${id} no encontrada`, 404);
  }

  const estadoAnterior = tarea.estado;

  await sequelize.transaction(async (t) => {
    await tarea.update({ estado: nuevoEstado }, { transaction: t });
    await HistorialEstado.create(
      {
        tareaId: tarea.id,
        estadoAnterior,
        estadoNuevo: nuevoEstado,
        fechaCambio: new Date(),
      },
      { transaction: t }
    );
  });

  return tarea;
};

/**
 * Returns a summary of tasks grouped by state for a given responsible user.
 * Also computes the average days to complete tasks (updatedAt - createdAt)
 * for COMPLETADA tasks updated within the last 30 days.
 * @param {number} idResponsable - The responsible user's numeric ID.
 * @returns {Promise<object>} Summary with counts per state and average completion days.
 */
const obtenerResumen = async (idResponsable) => {
  const ESTADOS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'];

  // Count tasks per state for the given responsible user
  const conteos = await Tarea.findAll({
    attributes: ['estado', [sequelize.fn('COUNT', sequelize.col('id')), 'total']],
    where: { idResponsable },
    group: ['estado'],
    raw: true,
  });

  // Build result map with zero defaults
  const resumen = ESTADOS.reduce((acc, e) => ({ ...acc, [e]: 0 }), {});
  for (const row of conteos) {
    resumen[row.estado] = parseInt(row.total, 10);
  }

  // Average days to complete for COMPLETADA tasks updated in the last 30 days
  const hace30Dias = new Date();
  hace30Dias.setDate(hace30Dias.getDate() - 30);

  const completadas = await Tarea.findAll({
    attributes: ['createdAt', 'updatedAt'],
    where: {
      idResponsable,
      estado: 'COMPLETADA',
      updatedAt: { [Op.gte]: hace30Dias },
    },
    raw: true,
  });

  let promediosDiasCompletadas = null;
  if (completadas.length > 0) {
    const totalDias = completadas.reduce((sum, t) => {
      const dias = (new Date(t.updatedAt) - new Date(t.createdAt)) / (1000 * 60 * 60 * 24);
      return sum + dias;
    }, 0);
    promediosDiasCompletadas = Math.round((totalDias / completadas.length) * 100) / 100;
  }

  return { responsable: idResponsable, resumen, promediosDiasCompletadas };
};

module.exports = { crearTarea, listarTareas, cambiarEstado, obtenerResumen };
