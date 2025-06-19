import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingService } from '../application/testing.service';

@Controller('testing')
export class TestingController {
  constructor(
    private testingService : TestingService
  ) {
  }

  @Delete()
  @HttpCode(204)
  async deleteAll(){
    return this.testingService
  }
}
