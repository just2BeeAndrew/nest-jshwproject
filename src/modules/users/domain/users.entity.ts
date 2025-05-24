import { Prop, Schema } from '@nestjs/mongoose';
import { AccountData } from './accountData.schema';
import { CreateUserDomainDto } from './dto/create-user.domain.dto';

@Schema()
export class User {
  accountData: AccountData;
}

static createInstatnce(dto: CreateUserDomainDto):UserDocument {

}
