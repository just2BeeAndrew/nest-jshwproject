import { CreateBlogDto } from '../../dto/create-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../domain/blogs.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class CreateBlogCommand {
  constructor(public dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
  implements ICommandHandler<CreateBlogCommand, string>
{
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogRepository: BlogsRepository,
  ) {}

  async execute({dto}: CreateBlogCommand): Promise<string> {
    const blog = await this.BlogModel.createInstance(dto);

    await this.blogRepository.save(blog);

    return blog._id.toString()
  }
}
