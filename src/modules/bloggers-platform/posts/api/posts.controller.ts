import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, HttpStatus,
  Param,
  Post,
  Put,
  Query, UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { CreatePostsInputDto } from './input-dto/create-posts.input-dto';
import { PostsViewDto } from './view-dto/posts.view-dto';
import { UpdatePostsInputDto } from './input-dto/update-posts.input-dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/query/comments.query-repository';
import { JwtAuthGuard } from '../../../../core/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../../../core/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../../../core/dto/user-context.dto';
import { CreateCommentInputDto } from '../../comments/api/input-dto/create-comment.input-dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCommentByIdQuery } from '../../comments/application/queries/get-comments-by-id.query-handler';
import { CreateCommentCommand } from '../../comments/application/usecases/create-coment.usecase';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}



  @Get(':postId/comments')
  @HttpCode(200)
  async getCommentsByPostId(@Param('postId') postId: string) {
    return this.commentsQueryRepository.getCommentByIdOrNotFoundFail(postId)
  }

  @Post(':postId/comments')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createComment(@ExtractUserFromRequest() user: UserContextDto,@Param('postId') postId: string,@Body() body: CreateCommentInputDto) {
    const comment = await this.commandBus.execute<CreateCommentCommand>(new CreateCommentCommand(user.id,postId,body.content));
    return this.queryBus.execute(new GetCommentByIdQuery(comment));
  }

  @Get(':id')
  @HttpCode(200)
  async getPostById(@Param('id') id: string) {
    return this.postsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get()
  @HttpCode(200)
  async getAllPosts(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    return this.postsQueryRepository.getAllPosts(query);
  }

  @Post()
  @HttpCode(201)
  async createPost(@Body() body: CreatePostsInputDto) {
    const postId = await this.postsService.createPost(body);

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }



  @Put(':id')
  @HttpCode(204)
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostsInputDto) {
    const postId = await this.postsService.updatePost(id, body);

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
