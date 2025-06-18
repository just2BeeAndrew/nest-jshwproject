import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query-repository';
import { CommentsViewDto } from './view-dto/comments.view-dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  @HttpCode(200)
  async getCommentById (@Param('id') id: string): Promise<CommentsViewDto> {
    return this.commentsQueryRepository.getCommentByIdOrNotFoundFail(id)
  }
}
