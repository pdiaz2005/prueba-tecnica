-- =============================================
-- Creación de tablas para Tasks API
-- SQL Server
-- =============================================

CREATE TABLE Tareas (
    id            INT IDENTITY(1,1) PRIMARY KEY,
    titulo        NVARCHAR(255)     NOT NULL,
    descripcion   NVARCHAR(MAX)     NULL,
    prioridad     NVARCHAR(10)      NOT NULL CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA')),
    idResponsable INT               NOT NULL,
    fechaLimite   DATE              NOT NULL,
    estado        NVARCHAR(20)      NOT NULL DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA')),
    createdAt     DATETIME2         NOT NULL DEFAULT GETDATE(),
    updatedAt     DATETIME2         NOT NULL DEFAULT GETDATE()
);

CREATE TABLE HistorialEstados (
    id             INT IDENTITY(1,1) PRIMARY KEY,
    tareaId        INT               NOT NULL,
    estadoAnterior NVARCHAR(20)      NULL,
    estadoNuevo    NVARCHAR(20)      NOT NULL,
    fechaCambio    DATETIME2         NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_HistorialEstados_Tareas FOREIGN KEY (tareaId)
        REFERENCES Tareas(id)
        ON DELETE CASCADE
);
