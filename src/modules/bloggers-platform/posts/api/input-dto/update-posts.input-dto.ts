import { UpdatePostDto } from '../../dto/update-post.dto';

export class UpdatePostsInputDto implements UpdatePostDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}