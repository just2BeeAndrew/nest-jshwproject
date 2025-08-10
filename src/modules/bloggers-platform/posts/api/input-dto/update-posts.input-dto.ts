import { UpdatePostDto } from '../../dto/update-post.dto';
import { IsStringTrimAndLength } from '../../../../../core/decorators/validation/is-string-trim-and-length';
import { contentConstants, shortDescriptionConstants, titleConstants } from '../../domain/posts.entity';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/is-string-with-trim';

export class UpdatePostsInputDto implements UpdatePostDto {
  @IsStringTrimAndLength(titleConstants.minLength, titleConstants.maxLength)
  title: string;

  @IsStringTrimAndLength(shortDescriptionConstants.minLength, shortDescriptionConstants.maxLength)
  shortDescription: string;

  @IsStringTrimAndLength(contentConstants.minLength, contentConstants.maxLength)
  content: string;

  @IsStringWithTrim()
  blogId: string;
}