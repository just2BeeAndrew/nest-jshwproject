import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class AccountData {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true })
  email: string;

  createdAt: Date;

  static create(login:string  , hash:string,email:string): AccountData {
    const data = new AccountData();
    data.login = login;
    data.email = email;
    data.passwordHash = hash;

    return data;
  }
}
