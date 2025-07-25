import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/users.entity';
import { Injectable } from '@nestjs/common';
import { DomainException } from '../../../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../../../core/exceptions/filters/domain-exception-codes';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private UserModel: UserModelType) {}

  async findById(id: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      _id: id,
      'accountData.deletedAt': null,
    });
  }

  async save(user: UserDocument) {
    await user.save();
  }

  async findOrNotFoundFail(id: string): Promise<UserDocument> {
    const user = await this.findById(id);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'User user not found',
      });
    }

    return user;
  }

  async findUserByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      'emailConfirmation.confirmationCode': confirmationCode,
    });
  }

  async findByLogin(login: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ 'accountData.login': login });
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({ 'accountData.email': email });
  }

  async findByRecoveryCode(recoveryCode: string): Promise<UserDocument | null> {
    return this.UserModel.findOne({
      'emailConfirmation.recoveryCode': recoveryCode,
    });
  }
}