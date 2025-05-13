import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class PostsDto {
  @Prop()
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  content: string;

  @Prop()
  blogId: string;
}