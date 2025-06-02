import { Module } from '@nestjs/common';
import { BcryptService } from './application/bcrypt.service';

@Module({
  providers: [BcryptService]
})
export class BcryptModule {}
