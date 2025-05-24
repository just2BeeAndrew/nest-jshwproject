import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
@Prop({ type: String, required: true })
  login: string;

@Prop({ type: String, required: true })
  passwordHash: string;

@Prop({ type: String , required: true })
  email: string;
}
