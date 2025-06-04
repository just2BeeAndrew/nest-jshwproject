import { GetBlogsQueryParams } from '../../api/input-dto/get-blogs-query-params.input-dto';
import { BlogsViewDto } from '../../api/view-dto/blogs.view-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { FilterQuery } from 'mongoose';
import { Blog, BlogModelType } from '../../domain/blogs.entity';
import { InjectModel } from '@nestjs/mongoose';

export class BlogsQueryRepository{
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType
  ) {
  }

  async getAllBlogs(
    query: GetBlogsQueryParams,
  ):Promise<PaginatedViewDto<BlogsViewDto[]>> {
    const filter: FilterQuery<Blog> = {
      deletedAt: null
    };

    if(query.searchNameTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        name: {$regex: query.searchNameTerm, $options: 'i'},
      })
    }

    const blogs = await this.BlogModel.find({filter})

    const totalCount = await this.BlogModel.countDocuments(filter)

    const items = blogs.map(BlogsViewDto.mapToView)

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize
    })
  }
}

