import { HttpStatus, INestApplication } from '@nestjs/common';
import { UsersTestManager } from './helpers/users-test-manager';
import { initSettings } from './helpers/init-settings';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { deleteAllData } from './helpers/delete-all-data';
import { MeViewDto } from '../src/modules/users/api/view-dto/me.view-dto';
import request from 'supertest';
import { EmailService } from '../src/modules/notifications/application/email.service';
import { GLOBAL_PREFIX } from '../src/setup/global-prefix.setup';
import { CreateUserDto } from '../src/modules/users/dto/create-user.dto';

describe('auth', () => {
  let app: INestApplication;
  let usersTestManager: UsersTestManager;

  beforeAll(async () => {
    const result = await initSettings((moduleBuilder) =>
      moduleBuilder.overrideProvider(JwtService).useValue(
        new JwtService({
          secret: 'access-token-secret',
          signOptions: { expiresIn: '1h' },
        }),
      ),
    );
    app = result.app;
    usersTestManager = result.userTestManager
  });

  afterAll(async () => {
    await app.close();
  })
  beforeEach(async () => {
    await deleteAllData(app);
  })

  it('/(GET)', () => {
    return request(app.getHttpServer()).get('/api').expect(200);
  });

  it('should return users info while "me" request with correct accessToken', async () => {
    const token = await usersTestManager.createAndLoginSeveralUsers(1);

    const responseBody = await usersTestManager.me(token[0].accessToken);

    expect(responseBody).toEqual({
      login: expect.anything(),
      userId: expect.anything(),
      email: expect.anything(),
    } as MeViewDto)
  });

  it(`should call email sending method while registration`, async () => {
    const sendEmailMethod = (app.get(EmailService).sendConfirmationEmail = jest
      .fn()
      .mockImplementation(() => Promise.resolve()));

    await request(app.getHttpServer())
      .post(`/${GLOBAL_PREFIX}/auth/registration`)
      .send({
        email: 'email@email.em',
        password: '123123123',
        login: 'login123',
      } as CreateUserDto)
      .expect(HttpStatus.NO_CONTENT);

    expect(sendEmailMethod).toHaveBeenCalled();
  });
});
