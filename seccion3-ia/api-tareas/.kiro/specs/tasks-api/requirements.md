# Requirements Document

## Introduction

API REST en Node.js con Express y Sequelize (ORM) conectada a SQL Server para gestión de tareas. Permite crear tareas, listarlas con filtros, cambiar su estado con historial de cambios y consultar un resumen estadístico por responsable.

## Glossary

- **Sistema**: La API REST de gestión de tareas
- **Tarea**: Unidad de trabajo con título, descripción, prioridad, responsable, fecha límite y estado
- **Responsable**: Identificador numérico del usuario asignado a una tarea
- **Estado**: Valor enumerado que representa el ciclo de vida de una tarea: PENDIENTE, EN_PROGRESO, COMPLETADA, CANCELADA
- **Prioridad**: Nivel de urgencia de una tarea: BAJA, MEDIA, ALTA
- **Historial de cambios**: Registro inmutable de cada transición de estado de una tarea
- **Resumen**: Agregado estadístico de tareas por estado y promedio de días para completarlas
- **Paginación**: Mecanismo para dividir resultados en páginas mediante parámetros `page` y `limit`
- **Sequelize**: ORM para Node.js utilizado para interactuar con SQL Server
- **Express**: Framework web de Node.js utilizado para el manejo de rutas y middleware

---

## Requirements

### Requirement 1

**User Story:** As a developer, I want to create a task via POST /tareas, so that tasks can be registered in the system with all required fields.

#### Acceptance Criteria

1. WHEN a POST /tareas request is received with valid `titulo`, `descripcion`, `prioridad`, `idResponsable`, and `fechaLimite`, THE Sistema SHALL persist the task in SQL Server and return the created task with HTTP 201.
2. IF `prioridad` is not one of BAJA, MEDIA, or ALTA, THEN THE Sistema SHALL return HTTP 422 with a descriptive validation error message.
3. IF `fechaLimite` is a date equal to or before the current date, THEN THE Sistema SHALL return HTTP 422 with a descriptive validation error message.
4. IF any required field (`titulo`, `prioridad`, `idResponsable`, `fechaLimite`) is absent from the request body, THEN THE Sistema SHALL return HTTP 422 with a descriptive validation error message.
5. WHEN a task is created, THE Sistema SHALL assign the initial state PENDIENTE automatically.

---

### Requirement 2

**User Story:** As a developer, I want to list tasks via GET /tareas with optional filters and pagination, so that consumers can retrieve relevant subsets of tasks efficiently.

#### Acceptance Criteria

1. WHEN a GET /tareas request is received, THE Sistema SHALL return a paginated list of tasks with HTTP 200.
2. WHILE the `estado` query parameter is present, THE Sistema SHALL filter results to tasks matching that state value.
3. WHILE the `responsable` query parameter is present, THE Sistema SHALL filter results to tasks assigned to that `idResponsable`.
4. WHILE both `desde` and `hasta` query parameters are present, THE Sistema SHALL filter results to tasks whose `fechaLimite` falls within that date range inclusive.
5. WHEN pagination parameters `page` and `limit` are provided, THE Sistema SHALL return the corresponding page slice and include `total`, `page`, and `limit` in the response metadata.

---

### Requirement 3

**User Story:** As a developer, I want to change a task's state via PATCH /tareas/:id/estado, so that the task lifecycle is tracked and every transition is recorded.

#### Acceptance Criteria

1. WHEN a PATCH /tareas/:id/estado request is received with a valid `estado` value, THE Sistema SHALL update the task state and return the updated task with HTTP 200.
2. WHEN a task state is updated, THE Sistema SHALL insert a record in the change history table with the previous state, the new state, and the timestamp of the change.
3. IF `estado` is not one of PENDIENTE, EN_PROGRESO, COMPLETADA, or CANCELADA, THEN THE Sistema SHALL return HTTP 422 with a descriptive validation error message.
4. IF no task exists for the given `:id`, THEN THE Sistema SHALL return HTTP 404 with a descriptive error message.

---

### Requirement 4

**User Story:** As a developer, I want to retrieve a summary via GET /tareas/resumen?responsable=:id, so that I can see how many tasks a responsible user has per state and the average days to complete tasks in the last 30 days.

#### Acceptance Criteria

1. WHEN a GET /tareas/resumen request is received with a valid `responsable` query parameter, THE Sistema SHALL return task counts grouped by state for that responsible user with HTTP 200.
2. WHEN computing the summary, THE Sistema SHALL include the average number of days between task creation and completion for tasks with state COMPLETADA whose completion occurred within the last 30 days.
3. IF the `responsable` query parameter is absent, THEN THE Sistema SHALL return HTTP 422 with a descriptive validation error message.
4. WHEN no tasks exist for the given `responsable`, THE Sistema SHALL return a summary with zero counts per state and a null average completion days value.

---

### Requirement 5

**User Story:** As a developer, I want centralized error handling and environment-based configuration, so that the API is maintainable, observable, and portable across environments.

#### Acceptance Criteria

1. WHEN any unhandled error occurs during request processing, THE Sistema SHALL return a JSON error response with an appropriate HTTP status code and a `message` field without exposing internal stack traces.
2. THE Sistema SHALL read the SQL Server connection string from an environment variable named `DB_CONNECTION_STRING`.
3. THE Sistema SHALL read the HTTP server port from an environment variable named `PORT`, defaulting to 3000 when the variable is absent.
4. WHEN the application starts, THE Sistema SHALL validate that required environment variables are present and exit with a non-zero code if any are missing.

---

### Requirement 6

**User Story:** As a developer, I want an integration test for the GET /tareas/resumen endpoint, so that the summary logic is verified against a real or test database.

#### Acceptance Criteria

1. WHEN the integration test suite runs, THE Sistema SHALL execute at least one test that calls GET /tareas/resumen with a valid `responsable` value and asserts the response structure and HTTP 200 status.
2. WHEN the integration test suite runs, THE Sistema SHALL execute at least one test that calls GET /tareas/resumen without the `responsable` parameter and asserts HTTP 422 is returned.
3. WHERE a test database is configured, THE Sistema SHALL use isolated test data that does not affect production data.
