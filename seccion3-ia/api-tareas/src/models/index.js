'use strict';

const sequelize = require('../config/database');
const Tarea = require('./Tarea');
const HistorialEstado = require('./HistorialEstado');

// Associations
Tarea.hasMany(HistorialEstado, { foreignKey: 'tareaId', as: 'historial' });
HistorialEstado.belongsTo(Tarea, { foreignKey: 'tareaId', as: 'tarea' });

// // Sync tables (alter: true updates schema without dropping data)
// const syncModels = async () => {
//   await sequelize.sync({ alter: true });
// };

module.exports = { sequelize, Tarea, HistorialEstado };
