import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDomainDto } from './dto/create-blog.domain.dto';
import { UpdateBlogsDomainDto } from './dto/update-blog.domain.dto';

export const nameConstants = {
  minLength: 1,
  maxLength: 15,
}

export const descriptionConstants = {
  minLength: 1,
  maxLength: 500,
}

export const websiteUrlConstants = {
  minLength: 1,
  maxLength: 100,
  match: /^https:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[-a-zA-Z0-9._~!$&'()*+,;=:@%]*)*\/?$/

}

@Schema({ timestamps: true })
export class Blog {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  websiteUrl: string;

  createdAt: Date;

  updatedAt: Date;

  @Prop({ type: String, nullable: true })
  deletedAt: Date | null;

  @Prop({ type: Boolean, required: false, default: false })
  isMembership: boolean;

  static createInstance(dto: CreateBlogDomainDto): BlogDocument {
    const blog = new this();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.deletedAt = null;

    return blog as BlogDocument;
  }

  update(dto: UpdateBlogsDomainDto) {
    if (this.name !== dto.name) this.name = dto.name;
    if (this.description !== dto.description) this.description = dto.description;
    if (this.websiteUrl !== dto.websiteUrl) this.websiteUrl = dto.websiteUrl;
  }

  softDelete() {
    if (this.deletedAt !== null) {
     throw new Error("Already deleted");
    }
    this.deletedAt = new Date();
  }

  static async clean(this: BlogModelType){
    await this.deleteMany({})
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

BlogSchema.loadClass(Blog);

export type BlogDocument = HydratedDocument<Blog>;

export type BlogModelType = Model<BlogDocument> & typeof Blog;
