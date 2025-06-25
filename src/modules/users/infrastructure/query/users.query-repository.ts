import { User, UserModelType } from '../../domain/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UsersViewDto } from '../../api/view-dto/users.view-dto';
import { Injectable, NotFoundException } from '@nestjs/common';

import { FilterQuery } from 'mongoose';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { UsersSortBy } from '../../api/input-dto/users-sort-by';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
  ) {}

  async getByIdOrNotFoundFail(id: string): Promise<UsersViewDto> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UsersViewDto.mapToView(user)
  }

  async getAllUsers(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UsersViewDto[]>> {
    const filter: FilterQuery<User> = {
      "accountData.deletedAt": null,
    };

    if (query.searchLoginTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        'accountData.login': { $regex: query.searchLoginTerm, $options: 'i' },
      });
    }

    if (query.searchEmailTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        'accountData.email': { $regex: query.searchEmailTerm, $options: 'i' },
      });
    }

    const sortByMapping = {
      [UsersSortBy.CreatedAt]: 'accountData.createdAt',
      [UsersSortBy.Login]: 'accountData.login',
      [UsersSortBy.Email]: 'accountData.createdAt',
    }

    const sortBy = sortByMapping[query.sortBy] || 'accountData.createdAt';

    const users = await this.UserModel.find( filter )
      .sort({ [sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.UserModel.countDocuments(filter);

    const items = users.map(UsersViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }
}
