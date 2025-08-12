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
import { CommentsViewDto } from './view-dto/comments.view-dto';
import { JwtAuthGuard } from '../../../../core/guards/bearer/jwt-auth.guard';
import { ExtractUserFromAccessToken } from '../../../../core/decorators/param/extract-user-from-access-token.decorator';
import { AccessContextDto } from '../../../../core/dto/access-context.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CommentLikeStatusCommand } from '../application/usecases/comment-like-status.usecase';
import { Public } from '../../../../core/decorators/public.decorator';
import { UpdateCommentInputDto } from './input-dto/update-comment.input-dto';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { GetCommentByIdQuery } from '../application/queries/get-comments-by-id.query-handler';
import { JwtOptionalAuthGuard } from '../../../../core/guards/bearer/jwt-optional-auth.guard';
import {
  ExtractOptionalUserFromRequest
} from '../../../../core/decorators/param/extract-optional-user-from-request.decorator';
import { LikesStatusInputDto } from '../../../../core/dto/likes-status.input-dto';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Public()
  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCommentById(
    @ExtractOptionalUserFromRequest() user: AccessContextDto | null,
    @Param('id') id: string,
  ): Promise<CommentsViewDto> {
    const userId = user ? user.id : null;
    return this.queryBus.execute(new GetCommentByIdQuery(id, userId));
  }

  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async commentLikeStatus(
    @ExtractUserFromAccessToken() user: AccessContextDto,
    @Param('commentId') commentId: string,
    @Body() likeStatus: LikesStatusInputDto,
  ) {
    return await this.commandBus.execute<CommentLikeStatusCommand>(
      new CommentLikeStatusCommand(user.id, commentId, likeStatus.likeStatus),
    );
  }

  @Put(':commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @ExtractUserFromAccessToken() user: AccessContextDto,
    @Param('commentId') commentId: string,
    @Body() body: UpdateCommentInputDto,
  ) {
    return await this.commandBus.execute<UpdateCommentCommand>(
      new UpdateCommentCommand(user.id, commentId, body.content),
    );
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(
    @ExtractUserFromAccessToken() user: AccessContextDto,
    @Param('commentId') commentId: string,
  ) {
    return await this.commandBus.execute<DeleteCommentCommand>(
      new DeleteCommentCommand(user.id, commentId),
    );
  }
}
