import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class AccountData {
  @Prop({ type: String, required: true, unique: true })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true })
  email: string;

  createdAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  static create(login:string  , passwordHash:string, email:string): AccountData {
    const data = new AccountData();
    data.login = login;
    data.email = email;
    data.passwordHash = passwordHash;
    data.deletedAt = null;

    return data;
  }
}
