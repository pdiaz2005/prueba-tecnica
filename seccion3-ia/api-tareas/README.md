Como levantar el proyecto

Se puede hacer de dos maneras en la ruta de /api-tareas se puede levantar con docker compose up, pero en este se tarda inicializando la base de datos la primera vez por todas las depednencias de SQL Server.

Segunda opción:

1. en /api-tareas/database/crete_table.sql estan las tablas creadas en SQL

2. Conectar la base de datos al /api-tareas modificando la conexión he info en .env de la base de datos.

3. Revisar si el sistema esta arriba, con las pruebas de postman que se encuentran en /api-tareas/postman descargarlo y cargarlo en postman para verificar que si este funcionando.

Por Pablo Díaz