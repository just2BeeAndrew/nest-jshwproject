import { Injectable } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserModelType} from '../domain/users.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(dto: CreateUserDto){

  }

  async deleteUser(id: string){

  }

}
