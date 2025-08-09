import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Status,
  StatusDocument,
  StatusModelType,
} from '../domain/status.entity';
import { Category } from '../../../../core/dto/category';
import { LikeStatus } from '../../../../core/dto/like-status';
import { LikeDetails } from '../../posts/domain/posts.entity';

@Injectable()
export class StatusRepository {
  constructor(@InjectModel(Status.name) private StatusModel: StatusModelType) {}

  async findStatus(
    userId: string,
    categoryId: string,
    category: Category,
  ): Promise<StatusDocument | null> {
    return this.StatusModel.findOne({
      userId: userId,
      categoryId: category,
      category: category,
    });
  }

  async getNewestLikes(postId: string) {
    const newestLikes = await this.StatusModel.find({
      categoryId: postId,
      category: Category.Post,
      status: LikeStatus.Like,
    })
      .sort({ createdAt: -1 })
      .limit(3);

    return newestLikes.map(like =>{
      return new LikeDetails(
        like.createdAt,
        like.userId,
        like.login,
      )
    });
  }

  async save(status: StatusDocument) {
    await status.save();
  }
}
