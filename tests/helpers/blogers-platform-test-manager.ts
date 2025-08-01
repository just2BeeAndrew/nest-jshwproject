import { HttpStatus, INestApplication } from '@nestjs/common';
import { CreateBlogInputDto } from '../../src/modules/bloggers-platform/blogs/api/input-dto/create-blogs.input-dto';
import { BlogsViewDto } from '../../src/modules/bloggers-platform/blogs/api/view-dto/blogs.view-dto';
import request from 'supertest';
import { GLOBAL_PREFIX } from '../../src/setup/global-prefix.setup';
import { CreatePostsInputDto } from '../../src/modules/bloggers-platform/posts/api/input-dto/create-posts.input-dto';
import { PostsViewDto } from '../../src/modules/bloggers-platform/posts/api/view-dto/posts.view-dto';

export class BlogersPlatformTestManager {
  constructor(private app: INestApplication) {}

  async createBlog(
    createModel: CreateBlogInputDto,
    statusCode: number = HttpStatus.CREATED,
  ): Promise<BlogsViewDto> {
    const response = await request(this.app.getHttpServer())
      .post(`/${GLOBAL_PREFIX}/blogs`)
      .send(createModel)
      .auth('admin', 'qwerty')
      .expect(statusCode);

    return response.body;
  }

  async createPost(
    blogId: string,
    createModel: CreatePostsInputDto,
    statusCode: number = HttpStatus.CREATED,
  ): Promise<PostsViewDto> {
    const response = await request(this.app.getHttpServer())
      .post(`/${GLOBAL_PREFIX}/posts`)
      .send(createModel)
      .auth('admin', 'qwerty')
      .expect(statusCode);

    return response.body;
  }
}
