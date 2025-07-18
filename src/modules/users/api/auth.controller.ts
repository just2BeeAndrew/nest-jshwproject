import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AuthQueryRepository } from '../infrastructure/query/auth.query-repository';
import { UsersService } from '../application/users.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from '../../../core/guards/local/local-auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { JwtAuthGuard } from '../../../core/guards/bearer/jwt-auth.guard';
import { MeViewDto } from './view-dto/me.view-dto';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private authQueryRepository: AuthQueryRepository,
  ) {}

  @SkipThrottle()
  @Post('login')
  @SkipThrottle()
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
  async login(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<{ accessToken: string }> {
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
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() body: CreateUserInputDto) {
    return this.authService.registration(body)
  }

  @Post('registration-email-resending')
  @HttpCode(200)
  async registrationEmailResending() {}

  @SkipThrottle()
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async me(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }
}
