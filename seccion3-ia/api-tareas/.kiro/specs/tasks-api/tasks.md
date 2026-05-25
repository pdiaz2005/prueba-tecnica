# Implementation Plan

- [x] 1. Inicializar proyecto y configuración base





  - Crear `package.json` con dependencias: express, sequelize, tedious, joi, dotenv
  - Crear `src/config/env.js` que lea y valide `DB_CONNECTION_STRING` y `PORT`
  - Crear `src/config/database.js` que instancie Sequelize con el dialecto mssql
  - Crear `.env.example` con las variables requeridas
  - _Requirements: 5.2, 5.3, 5.4_

- [x] 2. Definir modelos Sequelize





  - [x] 2.1 Crear modelo `Tarea` con todos sus campos y enums


    - Archivo `src/models/Tarea.js`
    - Campos: titulo, descripcion, prioridad, idResponsable, fechaLimite, estado
    - _Requirements: 1.1, 1.5_
  - [x] 2.2 Crear modelo `HistorialEstado` con FK a Tarea


    - Archivo `src/models/HistorialEstado.js`
    - Campos: tareaId, estadoAnterior, estadoNuevo, fechaCambio
    - _Requirements: 3.2_
  - [x] 2.3 Crear `src/models/index.js` con asociaciones y sincronización de tablas


    - Tarea.hasMany(HistorialEstado), HistorialEstado.belongsTo(Tarea)
    - _Requirements: 3.2_

- [x] 3. Implementar validadores joi





  - Crear `src/validators/tareaValidator.js` con esquemas para:
    - POST /tareas: titulo requerido, prioridad enum, fechaLimite > hoy, idResponsable número
    - PATCH /tareas/:id/estado: estado enum
    - GET /tareas/resumen: responsable requerido
  - _Requirements: 1.2, 1.3, 1.4, 3.3, 4.3_

- [x] 4. Implementar middleware de error centralizado





  - Crear `src/middlewares/errorHandler.js` con clase `AppError` y middleware de 4 argumentos
  - Devolver JSON `{ error, details }` sin stack trace en producción
  - _Requirements: 5.1_
-

- [x] 5. Implementar capa de servicio y controlador para POST /tareas




  - [x] 5.1 Crear `src/services/tareasService.js` con método `crearTarea`


    - Persistir tarea con estado inicial PENDIENTE
    - _Requirements: 1.1, 1.5_
  - [x] 5.2 Crear `src/controllers/tareasController.js` con handler `crearTarea`


    - Aplicar validador joi, llamar al servicio, responder HTTP 201
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 6. Implementar GET /tareas con filtros y paginación




  - [x] 6.1 Agregar método `listarTareas` en `tareasService.js`


    - Construir cláusula WHERE dinámica con estado, responsable, desde/hasta
    - Aplicar paginación con `limit` y `offset`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [x] 6.2 Agregar handler `listarTareas` en `tareasController.js`


    - Leer query params, llamar al servicio, responder con `data` y `meta`
    - _Requirements: 2.1, 2.5_

- [x] 7. Implementar PATCH /tareas/:id/estado





  - [x] 7.1 Agregar método `cambiarEstado` en `tareasService.js`


    - Buscar tarea por id, lanzar AppError 404 si no existe
    - Actualizar estado e insertar registro en HistorialEstado en una transacción
    - _Requirements: 3.1, 3.2, 3.4_
  - [x] 7.2 Agregar handler `cambiarEstado` en `tareasController.js`


    - Aplicar validador joi, llamar al servicio, responder HTTP 200
    - _Requirements: 3.1, 3.3_
-

- [x] 8. Implementar GET /tareas/resumen




  - [x] 8.1 Agregar método `obtenerResumen` en `tareasService.js`


    - Contar tareas por estado para el responsable dado
    - Calcular promedio de días (updatedAt - createdAt) para COMPLETADA en últimos 30 días
    - Retornar conteos en cero cuando no hay tareas
    - _Requirements: 4.1, 4.2, 4.4_
  - [x] 8.2 Agregar handler `obtenerResumen` en `tareasController.js`


    - Aplicar validador joi, llamar al servicio, responder HTTP 200
    - _Requirements: 4.1, 4.3_
-

- [x] 9. Configurar rutas y aplicación Express



  - Crear `src/routes/tareas.js` registrando los 4 endpoints (resumen antes de :id)
  - Crear `src/app.js` con express.json(), rutas y errorHandler
  - Crear `src/server.js` que importe app, conecte la BD y arranque el servidor
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1_

- [x] 10. Escribir test de integración para GET /tareas/resumen













  - [x] 10.1 Crear `tests/integration/resumen.test.js` con Jest y Supertest







    - Caso 1: responsable válido con tareas → HTTP 200 + estructura correcta
    - Caso 2: sin parámetro responsable → HTTP 422
    - Caso 3: responsable sin tareas → HTTP 200 con conteos en cero
    - _Requirements: 6.1, 6.2, 6.3_
