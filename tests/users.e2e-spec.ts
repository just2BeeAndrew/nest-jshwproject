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
import { UsersTestManager } from './helpers/users-test-manager';
import { PaginatedViewDto } from '../src/core/dto/base.paginated.view-dto';
import { UsersViewDto } from '../src/modules/users/api/view-dto/users.view-dto';

describe('users', () => {
  let app: INestApplication;
  let usersTestManager: UsersTestManager;
  let connection: Connection;

  beforeAll(async () => {});
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    appSetup(app);
    await app.init();

    usersTestManager = new UsersTestManager(app);

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
      .expect(HttpStatus.CREATED);

    expect(response.body).toEqual({
      id: expect.any(String),
      login: body.login,
      email: body.email,
      createdAt: expect.any(String),
    });
  });

  it('should get users with paging', async () => {
    const users = await usersTestManager.createSeveralUsers(12);
    const { body: responseBody } = (await request(app.getHttpServer())
      .get(`/${GLOBAL_PREFIX}/users?pageNumber=2&sortDirection=asc`)
      .auth('admin', 'qwerty')
      .expect(HttpStatus.OK)) as { body: PaginatedViewDto<UsersViewDto> };

    expect(responseBody.totalCount).toBe(12);
    expect(responseBody.items).toHaveLength(2);
    expect(responseBody.pagesCount).toBe(2);
    expect(responseBody.items[1]).toEqual(users[users.length - 1]);
  });

  it('should delete user', async () => {
    const body: CreateUserInputDto = {
      login: 'string',
      password: 'string',
      email: 'example@example.com',
    };
    const user = await usersTestManager.createUser(body);
    const response = await request(app.getHttpServer())
      .delete(`/${GLOBAL_PREFIX}/users/${user.id}`)
      .auth('admin', 'qwerty')
      .expect(HttpStatus.NO_CONTENT);
  });
});
