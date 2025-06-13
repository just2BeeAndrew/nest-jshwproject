import { Injectable } from '@nestjs/common';
import { PostModelType } from '../domain/posts.entity';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { CreatePostsDto } from '../dto/create-posts.dto';

@Injectable()
export class PostsService {
  constructor(
    private PostModel: PostModelType,
    private postsService: PostsService,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {
  }

  async createPost(dto: CreatePostsDto): Promise<string> {
    const {blogId} = dto
    const blog = await this.blogsRepository.getBlogByIdOrNotFoundFail(blogId)

    const post = this.PostModel.createInstance({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
    })

    await post.save();
    return post._id.toString();



  }


}
