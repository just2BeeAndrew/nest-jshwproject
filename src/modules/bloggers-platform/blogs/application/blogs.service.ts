import { Injectable } from '@nestjs/common';
import { BlogModelType } from '../domain/blogs.entity';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogsDto } from '../dto/update-blog.dto';
import { BlogsRepository } from '../infrastructure/blogs.repository';

@Injectable()
export class BlogsService {
  constructor(
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
}
