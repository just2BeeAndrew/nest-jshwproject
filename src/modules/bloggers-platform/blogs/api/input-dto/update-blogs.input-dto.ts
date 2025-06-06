import { UpdateBlogsDto } from '../../dto/update-blog.dto';

export class UpdateBlogsInputDto implements UpdateBlogsDto {
  name: string;
  description: string;
  websiteUrl: string;
}