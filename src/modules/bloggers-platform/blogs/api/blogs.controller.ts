import { Controller, Get, Post, Put, Delete, HttpCode, Query, Body, Param } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogsViewDto } from './view-dto/blogs.view-dto';
import { CreateBlogInputDto } from './input-dto/create-blogs.input-dto';
import { UpdateBlogsInputDto } from './input-dto/update-blogs.input-dto';
import { CreatePostsInputDto } from './input-dto/create-posts.input-dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import { PostsViewDto } from '../../posts/api/view-dto/posts.view-dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {
  }
  @Get()
  @HttpCode(200)
  async getAllBlogs(@Query() query: GetBlogsQueryParams): Promise<PaginatedViewDto<BlogsViewDto[]>>{
    return this.blogsQueryRepository.getAllBlogs(query);
  }

  @Post()
  @HttpCode(201)
  async createBlog(@Body() body: CreateBlogInputDto)/*:Promise<BlogsViewDto>*/ {
    const blogId = await this.blogsService.createBlog(body);

    return this.blogsQueryRepository.getBlogByIdOrNotFoundFail(blogId);
  }

  @Get(':blogId/posts')
  @HttpCode(200)
  async getAllPostsByBlogId(@Param('blogId') blogId:string, @Query() query: GetPostsQueryParams): Promise<PaginatedViewDto<PostsViewDto[]>>{
    return this.postsQueryRepository.getPostsByBlogId(blogId, query)
  }

  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostByBlogId(@Param('blogId') blogId: string, @Body() body:CreatePostsInputDto){
    const postId = await this.postsService.createPost({...body, blogId});

    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @Get(':id')
  @HttpCode(200)
  async  getBlogById(@Param('id') id: string){
    return this.blogsQueryRepository.getBlogByIdOrNotFoundFail(id)
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(@Param('id') id: string, @Body() body: UpdateBlogsInputDto){
    const blogId = await this.blogsService.updateBlog(id, body);

    return this.blogsQueryRepository.getBlogByIdOrNotFoundFail(blogId);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string) {
    return this.blogsService.deleteBlog(id)
  }

}
