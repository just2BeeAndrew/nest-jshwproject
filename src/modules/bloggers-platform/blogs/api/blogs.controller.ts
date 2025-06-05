import { Controller, Get, Post, Put, Delete, HttpCode, Query, Body } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogsViewDto } from './view-dto/blogs.view-dto';
import { CreateBlogInputDto } from './input-dto/blogs.input-dto';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {
  }
  @Get()
  @HttpCode(200)
  async getAllBlogs(@Query() query: GetBlogsQueryParams): Promise<PaginatedViewDto<BlogsViewDto[]>>{
    return this.blogsQueryRepository.getAllBlogs(query);
  }

  @Post()
  @HttpCode(201)
  async createBlog(@Body() body: CreateBlogInputDto):Promise<BlogsViewDto> {
    const blogId = this.blogsService.createBlog(body);

    return this.blogsQueryRepository.getBlogByIdOrNotFoundFail(blogId);
  }

  @Get(':blogId/posts')
  @HttpCode(200)
  async getAllPostsByBlogId(){}

  @Post(':blogId/posts')
  @HttpCode(201)
  async createPostByBlogId(){}

  @Get(':id')
  @HttpCode(200)
  async  getBlogById(){}

  @Put(':id')
  @HttpCode(204)
  async updateBlog(){}

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog() {}

}
