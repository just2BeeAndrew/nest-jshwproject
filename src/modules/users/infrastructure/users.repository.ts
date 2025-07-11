import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument, UserModelType} from '../domain/users.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType){}

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      _id: id,
      'accountData.deletedAt': null
    })
  }

  async save(user: UserDocument){
    await user.save();
  }

  async findOrNotFoundFail(id: string): Promise<UserDocument> {
    const user = await this.findById(id)

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    return user;
  }

  async findByLogin(login: string): Promise<boolean> {
    const isLoginTaken = await this.UserModel.findOne({
      'accountData.login': login
    })

    if (isLoginTaken) {
      return true
    }

    return false
  }

  async findByEmail(email: string): Promise<boolean> {
    const isEmailTaken = await this.UserModel.findOne({
      'accountData.email': email
    })

    if (isEmailTaken) {
      return true
    }

    return false
  }
}