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

  async validateUSer(
    login: string,
    password: string,
  ):Promise<UserContextDto | null> {
    const await this.usersRepository.findByLogin()
  }
}
