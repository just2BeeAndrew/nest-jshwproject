import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { CreatePostsInputDto } from './input-dto/create-posts.input-dto';
import { PostsViewDto } from './view-dto/posts.view-dto';
import { UpdatePostsInputDto } from './input-dto/update-posts.input-dto';
import { JwtAuthGuard } from '../../../../core/guards/bearer/jwt-auth.guard';
import { ExtractUserFromAccessToken } from '../../../../core/decorators/param/extract-user-from-access-token.decorator';
import { AccessContextDto } from '../../../../core/dto/access-context.dto';
import { CreateCommentInputDto } from '../../comments/api/input-dto/create-comment.input-dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCommentByIdQuery } from '../../comments/application/queries/get-comments-by-id.query-handler';
import { CreateCommentCommand } from '../../comments/application/usecases/create-coment.usecase';
import { PostLikeStatusCommand } from '../application/usecases/post-like-status.usecase';
import { JwtOptionalAuthGuard } from '../../../../core/guards/bearer/jwt-optional-auth.guard';
import { GetCommentsByPostIdQueryParams } from './input-dto/get-comments-query-params.input-dto';
import { GetCommentByPostIdQuery } from '../application/queries/get-comment-by-postId.query-handler';
import { GetAllPostsQuery } from '../application/queries/get-all-posts.query-handler';
import { GetPostByIdQuery } from '../application/queries/get-post-by-id.query-handler';
import { ExtractOptionalUserFromRequest } from '../../../../core/decorators/param/extract-optional-user-from-request.decorator';
import { LikesStatusInputDto } from '../../../../core/dto/likes-status.input-dto';
import { BasicAuthGuard } from '../../../../core/guards/basic/basic-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Put(':postId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async postLikeStatus(
    @ExtractUserFromAccessToken() user: AccessContextDto,
    @Param('postId') postId: string,
    @Body() likeStatus: LikesStatusInputDto,
  ) {
    return this.commandBus.execute<PostLikeStatusCommand>(
      new PostLikeStatusCommand(user.id, postId, likeStatus.likeStatus),
    );
  }

  @Get(':postId/comments')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtOptionalAuthGuard)
  async getCommentsByPostId(
    @ExtractOptionalUserFromRequest() user: AccessContextDto | null,
    @Param('postId') postId: string,
    @Query() query: GetCommentsByPostIdQueryParams,
  ) {
    const userId = user ? user.id : null;
    return this.queryBus.execute(
      new GetCommentByPostIdQuery(postId, query, userId),
    );
  }

  @Post(':postId/comments')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createComment(
    @ExtractUserFromAccessToken() user: AccessContextDto,
    @Param('postId') postId: string,
    @Body() body: CreateCommentInputDto,
  ) {
    const comment = await this.commandBus.execute<CreateCommentCommand>(
      new CreateCommentCommand(user.id, postId, body.content),
    );
    return this.queryBus.execute(new GetCommentByIdQuery(comment, user.id));
  }

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getPostById(
    @ExtractOptionalUserFromRequest() user: AccessContextDto | null,
    @Param('id') id: string,
  ) {
    const userId = user ? user.id : null;
    return this.queryBus.execute(new GetPostByIdQuery(id, userId));
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtOptionalAuthGuard)
  async getAllPosts(
    @ExtractOptionalUserFromRequest() user: AccessContextDto | null,
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const userId = user ? user.id : null;
    return this.queryBus.execute(new GetAllPostsQuery(query, userId));
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() body: CreatePostsInputDto) {
    const postId = await this.postsService.createPost(body);

    return this.postsQueryRepository.getPostById(postId);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostsInputDto) {
    const postId = await this.postsService.updatePost(id, body);

    return this.postsQueryRepository.getPostById(postId);
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
