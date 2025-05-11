import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Users  {
  @Prop()
  login: string;

  @Prop()
  passwordHash: string;

  @Prop()
  email: string;

  @Prop()
  createdAt: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);