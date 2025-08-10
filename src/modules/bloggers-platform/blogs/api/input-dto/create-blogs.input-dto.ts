import { CreateBlogDto } from '../../dto/create-blog.dto';
import { IsStringTrimAndLength } from '../../../../../core/decorators/validation/is-string-trim-and-length';
import { nameConstants, descriptionConstants, websiteUrlConstants } from '../../domain/blogs.entity';
import { Matches } from 'class-validator';

export class CreateBlogInputDto implements CreateBlogDto {
  @IsStringTrimAndLength(nameConstants.minLength, nameConstants.maxLength)
  name: string;

  @IsStringTrimAndLength(descriptionConstants.minLength, descriptionConstants.maxLength)
  description: string;

  @IsStringTrimAndLength(websiteUrlConstants.minLength, websiteUrlConstants.maxLength)
  @Matches(websiteUrlConstants.match)
  websiteUrl: string;
}
