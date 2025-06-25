import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { Blog } from '../../blogs/domain/blogs.entity';
import { CreatePostDomainDto } from './dto/create-posts.domain.dto';
import { UpdatePostsDomainDto } from './dto/update-posts.domain.dto';

@Schema()
export class LikeDetails {
  @Prop({ type: String, required: true })
  addedAt: string;

  @Prop({ type: String, nullable: true })
  userId: string | null;

  @Prop({ type: String, nullable: true })
  login: string | null;
}

@Schema()
export class ExtendedLikesInfo {
  @Prop({ type: Number, default: 0 })
  likesCount: number;

  @Prop({ type: Number, default: 0 })
  dislikesCount: number;

  @Prop({ type: Array<LikeDetails>, default: [] })
  newestLikes: LikeDetails[];
}

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: true })
  blogId: string;

  @Prop({ type: String, required: true })
  blogName: string;

  @Prop({ schema: ExtendedLikesInfo, required: true })
  extendedLikesInfo: ExtendedLikesInfo;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;

  createdAt: Date;

  static createInstance(dto: CreatePostDomainDto): PostDocument {
    const post = new this();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = dto.blogName;
    post.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      newestLikes: [],
    };

    return post as PostDocument;
  }

  update(dto: UpdatePostsDomainDto) {
    if (this.title !== dto.title) this.title = dto.title;
    if (this.shortDescription !== dto.shortDescription)
      this.shortDescription = dto.shortDescription;
    if (this.content !== dto.content) this.content = dto.content;
    if (this.blogId !== dto.blogId) this.blogId = dto.blogId;
    if (this.blogName !== dto.blogName) this.blogName = dto.blogName;
  }

  softDelete() {
    if (this.deletedAt !== null) {
      throw new Error('Already deleted');
    }
    this.deletedAt = new Date();
  }

  static async clean(this: PostModelType) {
    await this.deleteMany({})
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.loadClass(Post);

export type PostDocument = HydratedDocument<Post>;

export type PostModelType = Model<PostDocument> & typeof Post;
