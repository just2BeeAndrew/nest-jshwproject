import { Injectable } from '@nestjs/common';
import { PostModelType } from '../domain/posts.entity';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private PostModel: PostModelType,
    private postsService: PostsService,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const { blogId } = dto;
    const blog = await this.blogsRepository.getBlogByIdOrNotFoundFail(blogId);

    const post = this.PostModel.createInstance({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
    });

    await this.postsRepository.save(post);

    return post._id.toString();
  }

  async  updatePost(id: string, dto: UpdatePostDto): Promise<string> {
    const { blogId } = dto;

    const blog = await this.blogsRepository.getBlogByIdOrNotFoundFail(blogId);
    const {name} = blog;

    const post = await this.postsRepository.getPostByIdOrNotFoundFail(id)

    post.update({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: name,
    })

    await this.postsRepository.save(post);

    return post._id.toString();
  }
}
