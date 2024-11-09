import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { E2EApp } from './setup-e2e';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(() => {
    app = E2EApp;
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        const data = JSON.parse(response.text);
        expect(data.message).toEqual('Hello World!');
      })
  });
});
