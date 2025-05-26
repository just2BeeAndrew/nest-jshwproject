import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument, Model} from 'mongoose';
import { AccountData } from './accountData.schema';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';

@Schema()
export class User {
  accountData: AccountData;
}

static createInstatnce(dto: CreateUserDomainDto):UserDocument {

}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = HydratedDocument<User>;
