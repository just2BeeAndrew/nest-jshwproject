import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query } from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from './input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { CreatePostsInputDto } from './input-dto/create-posts.input-dto';
import { PostsViewDto } from './view-dto/posts.view-dto';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get(':postId')
  @HttpCode(200)
  async getCommentsByPostId() {

  }

  @Get()
  @HttpCode(200)
  async getAllPosts(@Query() query: GetPostsQueryParams): Promise<PaginatedViewDto<PostsViewDto[]>> {
    return this.postsQueryRepository.getAllPosts(query)
  }

  @Post()
  async createPost(@Body() body: CreatePostsInputDto) {
    const postId = await this.postsService.createPost(body)

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId)
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postsQueryRepository.getByIdOrNotFoundFail(id)

  }

  @Put(':id')
  async updatePost(@Param('id') id: string) {}

  @Delete(':id')
  async deletePost(@Param('id') id: string) {}
}
