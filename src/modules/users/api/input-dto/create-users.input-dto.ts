import { IsEmail, Length, Matches } from 'class-validator';

export class CreateUserInputDto {
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @Length(6, 20)
  password: string;

  @IsEmail()
  @Matches(/^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/,{message: 'Invalid email format'})
  email: string;
}
