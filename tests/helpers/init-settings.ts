import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { EmailService } from '../../src/modules/notifications/application/email.service';
import { EmailServiceMock } from '../mock/email-service.mock';
import { appSetup } from '../../src/setup/app.setup';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { UsersTestManager } from './users-test-manager';
import { deleteAllData } from './delete-all-data';
import { BlogersPlatformTestManager } from './blogers-platform-test-manager';

export const initSettings = async (
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(EmailService)
    .useClass(EmailServiceMock)

  if (addSettingsToModuleBuilder) {
    addSettingsToModuleBuilder(testingModuleBuilder);
  }

  const testingAppModule = await testingModuleBuilder.compile()

  const app = testingAppModule.createNestApplication()

  appSetup(app)

  await app.init()

  const databaseConnection = app.get<Connection>(getConnectionToken());
  const httpServer = app.getHttpServer();
  const userTestManager = new UsersTestManager(app)

  await deleteAllData(app)

  return{
    app,
    databaseConnection,
    httpServer,
    userTestManager,
  };
};