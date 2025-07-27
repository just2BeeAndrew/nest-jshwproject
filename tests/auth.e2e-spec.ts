import { INestApplication } from '@nestjs/common';
import { UsersTestManager } from './helpers/users-test-manager';
import { initSettings } from './helpers/init-settings';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { deleteAllData } from './helpers/delete-all-data';

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
});
