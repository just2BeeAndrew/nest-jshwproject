import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query-repository';
import { CommentsViewDto } from './view-dto/comments.view-dto';
import { LikesStatusDto } from './input-dto/likes-status.input-dto';
import { JwtAuthGuard } from '../../../../core/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../../../core/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../../../core/dto/user-context.dto';
import { CommandBus } from '@nestjs/cqrs';
import { LikeStatusCommand } from '../application/usecases/like-status.usecase';
import { Public } from '../../../../core/decorators/public.decorator';
import { UpdateCommentInputDto } from './input-dto/update-comment.input-dto';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getCommentById(@Param('id') id: string): Promise<CommentsViewDto> {
    return this.commentsQueryRepository.getCommentByIdOrNotFoundFail(id);
  }

  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async likeStatus(
    @ExtractUserFromRequest() user: UserContextDto,
    @Param('commentId') commentId: string,
    @Body() likeStatus: LikesStatusDto,
  ) {
    return await this.commandBus.execute<LikeStatusCommand>(
      new LikeStatusCommand(user.id, commentId, likeStatus.likesStatus),
    );
  }

  @Put(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @ExtractUserFromRequest() user: UserContextDto,
    @Param('commentId') commentId: string,
    @Body() body: UpdateCommentInputDto,
  ) {
    return await this.commandBus.execute<UpdateCommentCommand>(
      new UpdateCommentCommand(user.id, commentId, body.content),
    );
  }

  @Delete(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @ExtractUserFromRequest() user: UserContextDto,
    @Param('commentId') commentId: string,
  ) {
    return await this.commandBus.execute<DeleteCommentCommand>(
      new DeleteCommentCommand(user.id, commentId),
    );
  }
}
