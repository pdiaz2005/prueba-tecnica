const { Sequelize } = require('sequelize');
const { DB_NAME, DB_HOST, DB_INSTANCE, DB_USER, DB_PASSWORD } = require('./env');

// Use Windows Authentication when no user is provided (local dev),
// otherwise use SQL Server Authentication (Docker / remote).
const useWindowsAuth = !DB_USER;

const sequelize = new Sequelize(DB_NAME, DB_USER || null, DB_PASSWORD || null, {
  dialect: 'mssql',
  host: DB_HOST,
  logging: false,
  dialectOptions: {
    options: {
      ...(DB_INSTANCE && { instanceName: DB_INSTANCE }),
      trustedConnection: useWindowsAuth,
      trustServerCertificate: true,
    },
  },
});

module.exports = sequelize;
