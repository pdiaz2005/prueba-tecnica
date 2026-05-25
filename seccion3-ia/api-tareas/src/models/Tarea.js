'use strict';

const { Model, DataTypes } = require('sequelize');

class Tarea extends Model { }

Tarea.init(
  {
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    prioridad: {
      type: DataTypes.ENUM('BAJA', 'MEDIA', 'ALTA'),
      allowNull: false,
    },
    idResponsable: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fechaLimite: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'),
      allowNull: false,
      defaultValue: 'PENDIENTE',
    },
  },
  {
    sequelize: require('../config/database'),
    modelName: 'Tarea',
    tableName: 'Tareas',
    timestamps: true,
  }
);

module.exports = Tarea;
