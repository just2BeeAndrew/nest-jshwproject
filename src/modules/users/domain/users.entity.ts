import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { AccountData } from './accountData.schema';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';

@Schema()
export class User {
  @Prop({schema: AccountData})
  accountData: AccountData;

  static createInstance(dto: CreateUserDomainDto): UserDocument {
    const user = new this();

    user.accountData = AccountData.create(
      dto.login,
      dto.passwordHash,
      dto.email,
    );

    return user as UserDocument;
  }

  makeDeleted() {
    if (this.accountData.deletedAt !== null) {
      throw new Error('Deleted');
  }
    this.accountData.deletedAt = new Date();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
