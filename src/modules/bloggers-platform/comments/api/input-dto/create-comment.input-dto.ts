import { IsStringTrimAndLength } from '../../../../../core/decorators/validation/is-string-trim-and-length';
import { commentConstant } from '../../domain/comments.entity';

export class CreateCommentInputDto {
  @IsStringTrimAndLength(commentConstant.minLength, commentConstant.maxLength)
  content: string;
}