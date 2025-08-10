import { Module } from '@nestjs/common';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blogs.entity';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { PostsService } from './posts/application/posts.service';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './posts/infrastructure/query/posts.query-repository';
import { CommentsController } from './comments/api/comments.controller';
import { Post, PostSchema } from './posts/domain/posts.entity';
import { PostsController } from './posts/api/posts.controller';
import { Comment, CommentSchema } from './comments/domain/comments.entity';
import { CommentsQueryRepository } from './comments/infrastructure/query/comments.query-repository';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { CommentLikeStatusUseСase } from './comments/application/usecases/comment-like-status.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CalculateStatusCountUseCase } from './comments/application/usecases/calculate-status-count.usecase';
import { Status, StatusSchema } from './comments/domain/status.entity';
import { StatusRepository } from './comments/infrastructure/status.repository';
import { CreateCommentUseCase } from './comments/application/usecases/create-coment.usecase';
import { UsersModule } from '../users/users.module';
import { GetCommentByIdQueryHandler } from './comments/application/queries/get-comments-by-id.query-handler';
import { UpdateCommentUseCase } from './comments/application/usecases/update-comment.usecase';
import { PostLikeStatusUseCase } from './posts/application/usecases/post-like-status.usecase';
import { CreateBlogUseCase } from './blogs/application/usecases/create-blog.usecase';
import { GetBlogByIdQueryHandler } from './blogs/application/queries/get-blog-by-id.query-handler';
import { GetPostByIdQueryHandler } from './posts/application/queries/get-post-by-id.query-handler';
import { GetAllPostsQueryHandler } from './posts/application/queries/get-all-posts.query-handler';
import { GetPostsByBlogIdQueryHandler } from './posts/application/queries/get-post-by-blogId.query-handler';
import { DeleteCommentUseCase } from './comments/application/usecases/delete-comment.usecase';
import { GetCommentsByPostIdQueryHandler } from './posts/application/queries/get-comment-by-postId.query-handler';

const useCases = [
  CreateBlogUseCase,
  CommentLikeStatusUseСase,
  PostLikeStatusUseCase,
  CalculateStatusCountUseCase,
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
];

const query = [
  GetBlogByIdQueryHandler,
  GetAllPostsQueryHandler,
  GetPostsByBlogIdQueryHandler,
  GetPostByIdQueryHandler,
  GetCommentByIdQueryHandler,
  GetCommentsByPostIdQueryHandler,
];

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Status.name, schema: StatusSchema },
    ]),
    BcryptModule,
    CqrsModule,
    UsersModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsRepository,
    CommentsQueryRepository,
    StatusRepository,
    ...useCases,
    ...query,
  ],
  exports: [MongooseModule],
})
export class BloggersPlatformModule {}
