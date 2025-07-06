import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { emailConstants, loginConstants, passwordConstants } from '../../domain/users.entity';

export class CreateUserInputDto {
  @IsString()
  @Length(loginConstants.minLength, loginConstants.maxLength)
  @Matches(loginConstants.match)
  login: string;

  @IsString()
  @Length(passwordConstants.minLength, passwordConstants.maxLength)
  password: string;

  @IsString()
  @IsEmail()
  @Matches(emailConstants.match,{message: 'Invalid email format'})
  email: string;
}
