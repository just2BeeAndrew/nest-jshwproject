import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AuthQueryRepository } from '../infrastructure/query/auth.query-repository';
import { UsersService } from '../application/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private auuthQueryRepository: AuthQueryRepository,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login() {}

  @Post('password-recovery')
  @HttpCode(200)
  async passwordRecovvery() {}

  @Post('new-password')
  @HttpCode(200)
  async newPassword() {}

  @Post('registration-confirmation')
  @HttpCode(200)
  async registrationConfirmation() {}

  @Post('registration')
  @HttpCode(200)
  async registration() {}

  @Post('registration-email-resending')
  @HttpCode(200)
  async registrationEmailResending() {}

  @Get('me')
  @HttpCode(200)
  async me() {}
}
