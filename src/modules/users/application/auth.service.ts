import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { JwtService } from '@nestjs/jwt';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { BcryptService } from '../../bcrypt/application/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private bcryptService: BcryptService,

  ) {
  }

  async validateUser(
    login: string,
    password: string,
  ):Promise<UserContextDto | null> {
    const user = await this.usersRepository.findByLogin(login)
    if(!user){
      return null;
    }

    const isPasswordValid = await this.bcryptService.comparePassword({
      password: password,
      hash: user.accountData.passwordHash,
    })

    if(!isPasswordValid){
      return null;
    }

    return {id: user._id.toString()};
  }

  async login(userId: string) {
    const accessToken = this.jwtService.sign({id:userId} as UserContextDto);

    return {accessToken};
  }
}
