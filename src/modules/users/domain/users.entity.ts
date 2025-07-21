import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { AccountData } from './accountData.schema';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';
import { EmailConfirmation } from './emailConfirmation.schema';

export const loginConstants = {
  minLength: 3,
  maxLength: 10,
  match: /^[a-zA-Z0-9_-]*$/
}

export const passwordConstants = {
  minLength: 6,
  maxLength: 20,
}

export const emailConstants = {
  match: /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/,
}

@Schema()
export class User {
  @Prop({ schema: AccountData })
  accountData: AccountData;
  emailConfirmation: EmailConfirmation;

  static createInstance(dto: CreateUserDomainDto): UserDocument {
    const user = new this();

    user.accountData = AccountData.create(
      dto.login,
      dto.passwordHash,
      dto.email,
    );

    user.emailConfirmation = EmailConfirmation.create()

    return user as UserDocument;
  }

  setConfirmationCode(confirmationCode: string) {
    this.emailConfirmation.confirmationCode = confirmationCode;
  }

  setRecoveryCode(recoveryCode: string) {
    this.emailConfirmation.recoveryCode = recoveryCode;
  }

  setConfirmation(){
    this.emailConfirmation.isConfirmed = true;
  }

  makeDeleted() {
    if (this.accountData.deletedAt !== null) {
      throw new Error('Deleted');
    }
    this.accountData.deletedAt = new Date();
  }

  static async clean(this: UserModelType) {
    await this.deleteMany({})
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.loadClass(User);

export type UserDocument = HydratedDocument<User>;

export type UserModelType = Model<UserDocument> & typeof User;
