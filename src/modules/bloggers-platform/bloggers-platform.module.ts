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
import { CommentsService } from './comments/application/comments.service';
import { LikeStatusUseСase } from './comments/application/usecases/like-status.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import {
  CalculateStatusCountCommand,
  CalculateStatusCountUseCase,
} from './comments/application/usecases/calculate-status-count.usecase';
import { Status, StatusSchema } from './comments/domain/status.entity';
import { StatusRepository } from './comments/infrastructure/status.repository';
import { CreateCommandUseCase } from './comments/application/usecases/create-coment.usecase';
import { UsersModule } from '../users/users.module';
import { GetCommentByIdQueryHandler } from './comments/application/queries/get-comments-by-id.query-handler';

const useCases = [
  LikeStatusUseСase,
  CalculateStatusCountUseCase,
  CreateCommandUseCase,
];

const query = [GetCommentByIdQueryHandler]

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
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    StatusRepository,

    CommentsService,
    ...useCases,
    ...query,
  ],
  exports: [MongooseModule],
})
export class BloggersPlatformModule {}
