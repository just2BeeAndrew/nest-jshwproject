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
import { LikesStatusDto } from './input-dto/likes-status.input-dto';
import { JwtAuthGuard } from '../../../../core/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../../../core/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../../../core/dto/user-context.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CommentLikeStatusCommand } from '../application/usecases/comment-like-status.usecase';
import { Public } from '../../../../core/decorators/public.decorator';
import { UpdateCommentInputDto } from './input-dto/update-comment.input-dto';
import { UpdateCommentCommand } from '../application/usecases/update-comment.usecase';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.usecase';
import { GetCommentByIdQuery } from '../application/queries/get-comments-by-id.query-handler';
import { JwtOptionalAuthGuard } from '../../../../core/guards/bearer/jwt-optional-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(':id')
  @Public()
  @UseGuards(JwtOptionalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getCommentById(
    @ExtractUserFromRequest() user: UserContextDto,
    @Param('id') id: string,
  ): Promise<CommentsViewDto> {
    return this.queryBus.execute(new GetCommentByIdQuery(user.id,id));
  }

  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async commentLikeStatus(
    @ExtractUserFromRequest() user: UserContextDto,
    @Param('commentId') commentId: string,
    @Body() likeStatus: LikesStatusDto,
  ) {
    return await this.commandBus.execute<CommentLikeStatusCommand>(
      new CommentLikeStatusCommand(user.id, commentId, likeStatus.likesStatus),
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
