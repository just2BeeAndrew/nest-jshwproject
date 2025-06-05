import { Injectable } from '@nestjs/common';
import { BlogModelType } from '../domain/blogs.entity';
import { CreateBlogDto } from '../dto/create-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    private BlogModel: BlogModelType,
    private blogRepository,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<string> {
    const blog = await this.BlogModel.createInstance(dto);

    await this.blogRepository.save(blog);
    return blog._id.toString()
  }
}
