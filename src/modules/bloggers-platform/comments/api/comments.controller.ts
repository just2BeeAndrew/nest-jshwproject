import { Body, Controller, Get, HttpCode, HttpStatus, Param, Put, UseGuards } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query-repository';
import { CommentsViewDto } from './view-dto/comments.view-dto';
import { LikesStatusDto } from './input-dto/likes-status.input-dto';
import { JwtAuthGuard } from '../../../../core/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../../../core/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../../../core/dto/user-context.dto';
import { CommentsService } from '../application/comments.service';
import { CommandBus } from '@nestjs/cqrs';
import { LikeStatusCommand } from '../application/usecases/like-status.usecase';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsService: CommentsService,
  ) {}

  @Get(':id')
  @HttpCode(200)
  async getCommentById (@Param('id') id: string): Promise<CommentsViewDto> {
    return this.commentsQueryRepository.getCommentByIdOrNotFoundFail(id)
  }

  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async likeStatus (@ExtractUserFromRequest() user: UserContextDto, @Param('commentId') commentId: string, @Body() likeStatus: LikesStatusDto) {
    return await this.commandBus.execute<LikeStatusCommand>(new LikeStatusCommand(user.id,commentId,likeStatus.likesStatus) )
  }
}
