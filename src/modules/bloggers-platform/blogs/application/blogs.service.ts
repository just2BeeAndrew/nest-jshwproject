import { Injectable } from '@nestjs/common';
import { Blog, BlogModelType } from '../domain/blogs.entity';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogsDto } from '../dto/update-blog.dto';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogRepository: BlogsRepository,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<string> {
    const blog = await this.BlogModel.createInstance(dto);

    await this.blogRepository.save(blog);

    return blog._id.toString()
  }

  async updateBlog(id: string, dto: UpdateBlogsDto): Promise<string> {
    const blog = await this.blogRepository.getBlogByIdOrNotFoundFail(id)

    blog.update(dto)

    await this.blogRepository.save(blog);

    return blog._id.toString()
  }

  async deleteBlog(id: string) {
    const blog = await this.blogRepository.getBlogByIdOrNotFoundFail(id);

    blog.softDelete();

    await this.blogRepository.save(blog);
  }
}
