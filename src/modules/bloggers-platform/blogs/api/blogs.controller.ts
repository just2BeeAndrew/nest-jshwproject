import { Controller, Get, Post, Put, Delete, HttpCode, Query, Body, Param } from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogsViewDto } from './view-dto/blogs.view-dto';
import { CreateBlogInputDto } from './input-dto/create-blogs.input-dto';
import { UpdateBlogsDto } from '../dto/update-blog.dto';
import { UpdateBlogsInputDto } from './input-dto/update-blogs.input-dto';

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
  async deleteBlog() {}

}
