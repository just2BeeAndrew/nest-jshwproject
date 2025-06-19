import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../domain/posts.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType
  ) {}

  async findById(id: string): Promise<PostDocument | null> {
    return this.PostModel.findOne({
      _id: id,
      deletedAt: null
    })
  }

  async getPostByIdOrNotFoundFail(id: string): Promise<PostDocument> {
    const post = await this.findById(id)

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async save(post: PostDocument){
    await post.save();
  }


}