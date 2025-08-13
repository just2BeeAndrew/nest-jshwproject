import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtRefreshAuthGuard } from '../../../core/guards/bearer/jwt-refresh-auth.guard';
import { ExtractUserFromRefreshToken } from '../../../core/decorators/param/extract-user-from-refresh-token.decorator';
import { RefreshContextDto } from '../../../core/dto/refresh-context-dto';
import { CommandBus } from '@nestjs/cqrs';
import { GetAllSessionsQuery } from '../application/queries/get-all-sessions.query-heandler';

@Controller('security')
export class SessionsController {
  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Get('devices')
  @UseGuards(JwtRefreshAuthGuard)
  async getAllSessions(@ExtractUserFromRefreshToken() user: RefreshContextDto) {
    return this.commandBus.execute(new GetAllSessionsQuery(user.id))
  }
}
