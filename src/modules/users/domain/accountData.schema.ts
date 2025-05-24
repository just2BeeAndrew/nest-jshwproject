import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class AccountData {
  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true })
  createdat: string;
}
