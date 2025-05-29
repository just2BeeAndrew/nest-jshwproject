import { Injectable } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserModelType} from '../domain/users.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto){
    const passwordHAsh = await bcrypt.hash(dto.password, 10);

  }

  async deleteUser(id: string){

  }

}
