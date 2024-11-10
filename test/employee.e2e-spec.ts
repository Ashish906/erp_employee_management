import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { E2EApp, adminAccessToken } from './setup-e2e';
import { employeeData } from './seedData';

describe('Employee (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(() => {
    app = E2EApp;
    token = adminAccessToken;
    console.log('Token: ', token);
  });

  it('Should create an employee (POST)', () => {
    return request(app.getHttpServer())
      .post('/employees')
      .set('Authorization', `Bearer ${token}`)
      .send(employeeData)
      .then((response) => {
        console.log('===> error: ', response.error);
        expect(response.statusCode).toBe(201);
        const { data: { data } } = JSON.parse(response.text);
        expect(data.id).toEqual(2);
      })
  });
});
