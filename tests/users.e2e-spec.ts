import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { appSetup } from '../src/setup/app.setup';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { deleteAllData } from './helpers/delete-all-data';
import { CreateUserInputDto } from '../src/modules/users/api/input-dto/create-users.input-dto';
import request from 'supertest';
import { GLOBAL_PREFIX } from '../src/setup/global-prefix.setup';

describe('users', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);
    await app.init();

    connection = moduleFixture.get<Connection>(getConnectionToken());

    await deleteAllData(app);
  });

  afterEach(async () => {
    await app.close();
  });

  it('should create user', async () => {
    const body: CreateUserInputDto = {
      login: 'lg-197286',
      password: 'string',
      email: 'example@example.com',
    };
    const response = await request(app.getHttpServer())
      .post(`/${GLOBAL_PREFIX}/users`)
      .send(body)
      .auth('admin', 'qwerty')
      .expect(HttpStatus.CREATED)

      expect(response.body).toEqual({
        id:expect.any(String),
        login: body.login,
        email: body.email,
        createdAt: expect.any(String),
      })
  });
});
