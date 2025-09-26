import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import { GetBlogsQueryParams } from './input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { BlogsViewDto } from './view-dto/blogs.view-dto';
import { CreateBlogInputDto } from './input-dto/create-blogs.input-dto';
import { UpdateBlogsInputDto } from './input-dto/update-blogs.input-dto';
import { CreatePostsInputDto } from './input-dto/create-posts.input-dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import { PostsViewDto } from '../../posts/api/view-dto/posts.view-dto';
import { BasicAuthGuard } from '../../../../core/guards/basic/basic-auth.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBlogByIdQuery } from '../application/queries/get-blog-by-id.query-handler';
import { CreateBlogCommand } from '../application/usecases/create-blog.usecase';
import { JwtOptionalAuthGuard } from '../../../../core/guards/bearer/jwt-optional-auth.guard';
 import { AccessContextDto } from '../../../../core/dto/access-context.dto';
import { GetPostsByBlogIdQuery } from '../../posts/application/queries/get-post-by-blogId.query-handler';
import { LikeStatus } from '../../../../core/dto/like-status';
import { ExtractOptionalUserFromRequest } from '../../../../core/decorators/param/extract-optional-user-from-request.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private blogsService: BlogsService,
    private postsService: PostsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllBlogs(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogsViewDto[]>> {
    return this.blogsQueryRepository.getAllBlogs(query);
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() body: CreateBlogInputDto) {
    const blogId = await this.commandBus.execute<CreateBlogCommand, string>(
      new CreateBlogCommand(body),
    );

    return this.queryBus.execute(new GetBlogByIdQuery(blogId));
  }

  @Get(':blogId/posts')
  @UseGuards(JwtOptionalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllPostsByBlogId(
    @ExtractOptionalUserFromRequest() user: AccessContextDto,
    @Param('blogId') blogId: string,
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostsViewDto[]>> {
    const userid = user ? user.id : null;
    return this.queryBus.execute(
      new GetPostsByBlogIdQuery(blogId, query, userid),
    );
  }

  @Post(':blogId/posts')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(BasicAuthGuard)
  async createPostByBlogId(
    @Param('blogId') blogId: string,
    @Body() body: CreatePostsInputDto,
  ) {
    const postId = await this.postsService.createPost({ ...body, blogId });

    return this.postsQueryRepository.getByIdOrNotFoundFail(
      postId,
      LikeStatus.None,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getBlogById(@Param('id') id: string) {
    return this.blogsQueryRepository.getBlogByIdOrNotFoundFail(id);
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param('id') id: string, @Body() body: UpdateBlogsInputDto) {
    const blogId = await this.blogsService.updateBlog(id, body);

    return this.blogsQueryRepository.getBlogByIdOrNotFoundFail(blogId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(BasicAuthGuard)
  async deleteBlog(@Param('id') id: string) {
    return this.blogsService.deleteBlog(id);
  }
}
