import { IsStringTrimAndLength } from '../../../../core/decorators/validation/is-string-trim-and-length';
import { passwordConstants } from '../../domain/users.entity';
import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';

export class newPasswordInputDto {
  @IsStringTrimAndLength(passwordConstants.minLength, passwordConstants.maxLength)
  newPassword: string;

  @IsStringWithTrim()
  recoveryCode: string;
}