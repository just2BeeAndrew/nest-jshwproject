import { CreateUserInputDto } from '../../src/modules/users/api/input-dto/create-users.input-dto';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UsersViewDto } from '../../src/modules/users/api/view-dto/users.view-dto';
import request from 'supertest';
import { GLOBAL_PREFIX } from '../../src/setup/global-prefix.setup';
import { delay } from './delay';

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
}
