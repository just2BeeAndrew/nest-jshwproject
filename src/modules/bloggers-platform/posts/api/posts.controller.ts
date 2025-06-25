import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { CreatePostsInputDto } from './input-dto/create-posts.input-dto';
import { PostsViewDto } from './view-dto/posts.view-dto';
import { UpdatePostsInputDto } from './input-dto/update-posts.input-dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/query/comments.query-repository';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}



  @Get(':postId/comments')
  @HttpCode(200)
  async getCommentsByPostId(@Param('postId') postId: string) {
    return this.commentsQueryRepository.getCommentByIdOrNotFoundFail(postId)
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
