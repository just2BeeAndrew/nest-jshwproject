import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AuthQueryRepository } from '../infrastructure/query/auth.query-repository';
import { UsersService } from '../application/users.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { ApiBody } from '@nestjs/swagger';
import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private auuthQueryRepository: AuthQueryRepository,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBody({
      schema: {
        type: 'object',
        properties: {
          login: { type: 'string', example: 'login123' },
          password: { type: 'string', example: 'superpassword' },
        },
      },
    })
  async login(@ExtractUserFromRequest() user: UserContextDto): Promise<{accessToken: string}> {
    return this.authService.login(user.id);
  }

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
