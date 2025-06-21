import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingService } from '../application/testing.service';

@Controller('testing')
export class TestingController {
  constructor(
    private testingService : TestingService
  ) {
  }

  @Delete('testing-all')
  @HttpCode(204)
  async deleteAll(){
    return this.testingService.deleteAll()
  }
}
