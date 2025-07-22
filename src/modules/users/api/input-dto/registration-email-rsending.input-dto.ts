import { IsStringWithTrim } from '../../../../core/decorators/validation/is-string-with-trim';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { emailConstants } from '../../domain/users.entity';

export class RegistrationEmailRsendingInputDto {
  @IsStringWithTrim()
  @IsNotEmpty()
  @IsEmail()
  @Matches(emailConstants.match,{message: 'Invalid email format'})
  email: string;
}