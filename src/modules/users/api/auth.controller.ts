import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AuthQueryRepository } from '../infrastructure/query/auth.query-repository';
import { LocalAuthGuard } from '../../../core/guards/local/local-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ExtractUserFromAccessToken } from '../../../core/decorators/param/extract-user-from-access-token.decorator';
import { AccessContextDto } from '../../../core/dto/access-context.dto';
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
import { Request, Response } from 'express';
import { DomainException } from '../../../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../../../core/exceptions/filters/domain-exception-codes';
import { JwtRefreshAuthGuard } from '../../../core/guards/bearer/jwt-refresh-auth.guard';
import { ExtractUserFromRefreshToken } from '../../../core/decorators/param/extract-user-from-refresh-token.decorator';
import { RefreshContextDto } from '../../../core/dto/refresh-context-dto';
import { RefreshTokenCommand } from '../application/usecases/refresh-token.usecase';
import { LogoutCommand } from '../application/usecases/logout.usecase';

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
    @ExtractUserFromAccessToken() user: AccessContextDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ): Promise<{ accessToken: string }> {
    const title = req.headers['user-agent'];
    if (!title) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not Found',
        extensions: [{ message: 'Header not found', key: ' Header' }],
      });
    }

    const forwarded = req.headers['x-forwarded-for'] as string;
    const ipFromHeader = forwarded ? forwarded.split(',')[0].trim() : null;
    const ip =
      ipFromHeader || req.ip || req.socket.remoteAddress || 'IP не определён';

    const { accessToken, refreshToken } =
      await this.commandBus.execute<LoginCommand>(
        new LoginCommand({ userId: user.id }, title, ip),
      );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }

  @Post('refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @ExtractUserFromRefreshToken() user: RefreshContextDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.commandBus.execute<RefreshTokenCommand>(
        new RefreshTokenCommand(user.id, user.sessionId),
      );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
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

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtRefreshAuthGuard)
  async logout(@ExtractUserFromRefreshToken() user: RefreshContextDto, @Res({ passthrough: true }) res: Response,) {
    await this.commandBus.execute<LogoutCommand>(new LogoutCommand(user.id, user.sessionId));
    res.clearCookie('refreshToken', { httpOnly: true , secure: true });
  }

  @SkipThrottle()
  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async me(
    @ExtractUserFromAccessToken() user: AccessContextDto,
  ): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }
}
