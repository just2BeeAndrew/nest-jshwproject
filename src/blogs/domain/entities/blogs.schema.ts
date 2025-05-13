import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BlogsDto {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  websiteUrl: string;
}