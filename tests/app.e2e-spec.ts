import { appSetup } from '../src/setup/app.setup';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    appSetup(app)

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  })

  it('/(GET)', () => {
    return request(app.getHttpServer()).get('/api').expect(200);
  });
});
