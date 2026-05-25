'use strict';

const { Model, DataTypes } = require('sequelize');

class HistorialEstado extends Model {}

HistorialEstado.init(
  {
    tareaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estadoAnterior: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    estadoNuevo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    fechaCambio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: require('../config/database'),
    modelName: 'HistorialEstado',
    tableName: 'HistorialEstados',
    timestamps: false,
  }
);

module.exports = HistorialEstado;
