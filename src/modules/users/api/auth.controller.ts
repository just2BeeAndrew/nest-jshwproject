import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AuthQueryRepository } from '../infrastructure/query/auth.query-repository';
import { UsersService } from '../application/users.service';
import { LocalAuthGuard } from '../../../core/guards/local/local-auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ExtractUserFromRequest } from '../../../core/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../../core/dto/user-context.dto';
import { JwtAuthGuard } from '../../../core/guards/bearer/jwt-auth.guard';
import { MeViewDto } from './view-dto/me.view-dto';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery.input-dto';
import { newPasswordInputDto } from './input-dto/newPassword.input-dto';
import { RegistrationEmailRsendingInputDto } from './input-dto/registration-email-rsending.input-dto';
import { RegistrationConfirmationCodeInputDto } from './input-dto/confirmation-code.input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '../application/usecases/login.usecases';
import { Response } from 'express';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private authService: AuthService,
    private authQueryRepository: AuthQueryRepository,
  ) {}

  @SkipThrottle()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @ExtractUserFromRequest() user: UserContextDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } =
      await this.commandBus.execute<LoginCommand>(
        new LoginCommand({ userId: user.id }),
      );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return {accessToken};
  }

  @Post('password-recovery')
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() body: PasswordRecoveryInputDto) {
    return this.authService.passwordRecovery(body.email);
  }

  @Post('new-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async newPassword(@Body() body: newPasswordInputDto) {
    return this.authService.newPassword(body);
  }

  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(
    @Body() code: RegistrationConfirmationCodeInputDto,
  ) {
    return this.authService.registrationConfirmation(code.code);
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() body: CreateUserInputDto) {
    return this.authService.registration(body);
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() body: RegistrationEmailRsendingInputDto,
  ) {
    return this.authService.registrationEmailResending(body.email);
  }

  @SkipThrottle()
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }
}
