import { IsNotEmpty } from 'class-validator';
import { IsStringTrimAndLength } from '../../../../../core/decorators/validation/is-string-trim-and-length';
import { commentConstant } from '../../domain/comments.entity';

export class UpdateCommentInputDto {
  @IsStringTrimAndLength(commentConstant.minLength, commentConstant.maxLength)
  @IsNotEmpty()
  content: string;
}
