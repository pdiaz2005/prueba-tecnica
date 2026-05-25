'use strict';

// Mock the database config so no real DB connection is attempted
jest.mock('../../src/config/database', () => {
  const { Sequelize } = require('sequelize');
  return new Sequelize('sqlite::memory:', { logging: false });
});

const request = require('supertest');
const app = require('../../src/app');

// Mock the service layer to isolate HTTP/validation logic from DB
jest.mock('../../src/services/tareasService', () => ({
  crearTarea: jest.fn(),
  listarTareas: jest.fn(),
  cambiarEstado: jest.fn(),
  obtenerResumen: jest.fn(),
}));

const tareasService = require('../../src/services/tareasService');

describe('GET /tareas/resumen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Caso 1: responsable válido con tareas → HTTP 200 + estructura correcta
  it('returns 200 with correct structure when responsable has tasks', async () => {
    tareasService.obtenerResumen.mockResolvedValue({
      responsable: 5,
      resumen: {
        PENDIENTE: 3,
        EN_PROGRESO: 1,
        COMPLETADA: 2,
        CANCELADA: 0,
      },
      promediosDiasCompletadas: 4.5,
    });

    const res = await request(app).get('/tareas/resumen?responsable=5');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      responsable: 5,
      resumen: {
        PENDIENTE: expect.any(Number),
        EN_PROGRESO: expect.any(Number),
        COMPLETADA: expect.any(Number),
        CANCELADA: expect.any(Number),
      },
      promediosDiasCompletadas: expect.any(Number),
    });
    expect(tareasService.obtenerResumen).toHaveBeenCalledWith(5);
  });

  // Caso 2: sin parámetro responsable → HTTP 422
  it('returns 422 when responsable query param is missing', async () => {
    const res = await request(app).get('/tareas/resumen');

    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('error');
    expect(tareasService.obtenerResumen).not.toHaveBeenCalled();
  });

  // Caso 3: responsable sin tareas → HTTP 200 con conteos en cero
  it('returns 200 with zero counts when responsable has no tasks', async () => {
    tareasService.obtenerResumen.mockResolvedValue({
      responsable: 99,
      resumen: {
        PENDIENTE: 0,
        EN_PROGRESO: 0,
        COMPLETADA: 0,
        CANCELADA: 0,
      },
      promediosDiasCompletadas: null,
    });

    const res = await request(app).get('/tareas/resumen?responsable=99');

    expect(res.status).toBe(200);
    expect(res.body.resumen).toEqual({
      PENDIENTE: 0,
      EN_PROGRESO: 0,
      COMPLETADA: 0,
      CANCELADA: 0,
    });
    expect(res.body.promediosDiasCompletadas).toBeNull();
  });
});
