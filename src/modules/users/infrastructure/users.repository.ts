import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument, UserModelType} from '../domain/users.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType){}

  async save(user: UserDocument){
    await user.save();
  }
}