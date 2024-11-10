import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Sequelize } from 'sequelize-typescript';
import * as request from 'supertest';

let app: INestApplication;
let sequelize: Sequelize;
let adminAccessToken: string;
let employeeAccessToken: string;

async function seedDatabase() {
  const today = new Date();
  await sequelize.models.UserEntity.bulkCreate([
    {
      id: 1,
      email: 'admin@test.com',
      password: '$2a$10$.odynwX6UcVMFBpp/oC2..ilJ15kS.msmMO3HRPhZKwHp.vet.Wk2',
      name: 'Test Admin',
      is_active: true,
      role: 'admin',
      created_at: today,
      updated_at: today,
    },
    {
      id: 2,
      email: 'employee@test.com',
      password: '$2a$10$.odynwX6UcVMFBpp/oC2..ilJ15kS.msmMO3HRPhZKwHp.vet.Wk2',
      name: 'Test Employee',
      is_active: true,
      role: 'employee',
    }
  ], {});

  await sequelize.models.PositionEntity.bulkCreate([
    {
      id: 1,
      name: 'Test Employee',
      created_at: today,
      updated_at: today,
    }
  ], {});

  await sequelize.models.EmployeeEntity.bulkCreate([
    {
      id: 1,
      name: 'Test Employee',
      position_id: 1,
      supervisor_id: null,
      left_boundary: 1,
      right_boundary: 2,
      user_id: 2,
      created_at: today,
      updated_at: today,
    }
  ], {});
}

async function clearDatabase() {
  const models = sequelize.models;
  for (const model of Object.values(models)) {
    await model.destroy({ where: {}, truncate: true, force: true, cascade: true });
  }
}

beforeAll(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
  sequelize = app.get(Sequelize);

  await clearDatabase();
  await seedDatabase();

  const response: any = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: 'admin@test.com', password: '123456' });
  const data = JSON.parse(response.text);
  adminAccessToken = data.data?.access_token
});

afterAll(async () => {
  await clearDatabase();
  await app.close();
});

describe('Check and get login access token',() => {
  it('Should login via admin credentials', () => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: '123456' })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        const data = JSON.parse(response.text);
        expect(data.status).toEqual(200);
        expect(typeof data.data?.access_token).toBe('string');
        expect(typeof data.data?.refresh_token).toBe('string');

        adminAccessToken = data.data.access_token;
      });
  });

  it('Should throw error for invalid credentials', () => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: '1234567' })
      .then((response) => {
        expect(response.statusCode).toBe(400);
        const data = JSON.parse(response.text);
        expect(data.message).toEqual('Unauthorized');
      });
  });

  it('Should login via employee credentials', () => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'employee@test.com', password: '123456' })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        const data = JSON.parse(response.text);
        expect(data.status).toEqual(200);
        expect(typeof data.data?.access_token).toBe('string');
        expect(typeof data.data?.refresh_token).toBe('string');

        employeeAccessToken = data.data.access_token;
      });
  });
});

export { app as E2EApp, adminAccessToken, employeeAccessToken };
