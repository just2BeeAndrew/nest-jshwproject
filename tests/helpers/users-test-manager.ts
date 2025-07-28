import { CreateUserInputDto } from '../../src/modules/users/api/input-dto/create-users.input-dto';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UsersViewDto } from '../../src/modules/users/api/view-dto/users.view-dto';
import request from 'supertest';
import { GLOBAL_PREFIX } from '../../src/setup/global-prefix.setup';
import { delay } from './delay';
import { MeViewDto } from '../../src/modules/users/api/view-dto/me.view-dto';

export class UsersTestManager {
  constructor(private app: INestApplication) {}

  async createUser(
    createModel: CreateUserInputDto,
    statusCode: number = HttpStatus.CREATED,
  ): Promise<UsersViewDto> {
    const response = await request(this.app.getHttpServer())
      .post(`/${GLOBAL_PREFIX}/users`)
      .send(createModel)
      .auth('admin', 'qwerty')
      .expect(statusCode);

    return response.body;
  }

  async createSeveralUsers(count: number): Promise<UsersViewDto[]> {
    const usersPromises = [] as Promise<UsersViewDto>[];

    for (let i = 0; i < count; ++i) {
      await delay(50)
      const response = this.createUser({
        login: `test` + i,
        email: `test${i}@gmail.com`,
        password: `123456789`,
      });
      usersPromises.push(response);
    }
    return Promise.all(usersPromises);
  }

  async login(
    loginOrEmail: string,
    password: string,
    statusCode: number = HttpStatus.OK,
  ): Promise<{ accessToken: string }> {
    const response = await request(this.app.getHttpServer())
      .post(`/${GLOBAL_PREFIX}/auth/login`)
      .send({ loginOrEmail, password })
      .expect(statusCode);

    return {
      accessToken: response.body.accessToken,
    };
  }

  async me(
    accessToken: string,
    statusCode: number = HttpStatus.OK,
  ): Promise<MeViewDto> {
    const response = await request(this.app.getHttpServer())
      .get(`/${GLOBAL_PREFIX}/auth/me`)
      .auth(accessToken, { type: 'bearer' })
      .expect(statusCode);

    return response.body;
  }

  async createAndLoginSeveralUsers(
    count: number,
  ): Promise<{ accessToken: string }[]> {
    const users = await this.createSeveralUsers(count);

    const loginPromises = users.map((user: UsersViewDto) =>
      this.login(user.login, '123456789'),
    );

    return await Promise.all(loginPromises);
  }
}
