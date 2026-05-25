'use strict';

const app = require('./app');
const sequelize = require('./config/database');
const { PORT } = require('./config/env');

// Import models so Sequelize registers them and syncs the schema.
require('./models');

(async () => {
  await sequelize.authenticate();
  // await sequelize.sync({ alter: true });
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
