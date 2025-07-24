import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { appSetup } from '../src/setup/app.setup';

describe('users', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports:[AppModule]
    }).compile();
    
    app = moduleFixture.createNestApplication();
    
    appSetup(app)
    
    await app.init()
  });
  
  afterEach(async () => {
    await app.close();
  })

  it('should ', () => {
    
  });
})