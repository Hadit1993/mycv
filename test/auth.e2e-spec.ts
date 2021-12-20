import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication system', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const sendingEmail = 'huhuhuhbhbh@uhuhu.com';
    return request(app.getHttpServer())
      .post('/auth/signup/')
      .send({ email: sendingEmail, password: 'ikjsuhuhyufh' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body.data;
        expect(id).toBeDefined();
        expect(email).toBe(sendingEmail);
      });
  });

  it('signup as a new user and get the current logged in user', async () => {
    const sendingEmail = 'huhuhuhbhbh@uhuhu.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup/')
      .send({ email: sendingEmail, password: 'ikjsuhuhyufh' })
      .expect(201);

    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami/')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.data.email).toEqual(sendingEmail);
  });
});
