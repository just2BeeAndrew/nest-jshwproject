import { User, UserModelType } from '../../domain/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UsersViewDto } from '../../api/view-dto/users.view-dto';
import { NotFoundException } from '@nestjs/common';

export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async getAllUsers(): Promise<UsersViewDto[]> {
    const result = await this.UserModel.find().exec();

    return result.map((user) => UsersViewDto.mapToView(user))
  }
}
