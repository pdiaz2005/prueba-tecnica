#!/bin/bash
set -e

echo "Waiting for SQL Server to be ready..."

until /opt/mssql-tools18/bin/sqlcmd -S "$DB_HOST" -U "$DB_USER" -P "$DB_PASSWORD" -Q "SELECT 1" -No -C &>/dev/null; do
  echo "SQL Server not ready yet, retrying in 5s..."
  sleep 5
done

echo "SQL Server is ready. Running init script..."
/opt/mssql-tools18/bin/sqlcmd -S "$DB_HOST" -U "$DB_USER" -P "$DB_PASSWORD" -i /app/database/init.sql -No -C

echo "Starting API..."
exec node src/server.js
