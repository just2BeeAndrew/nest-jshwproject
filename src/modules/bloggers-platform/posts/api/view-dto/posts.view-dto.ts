import { LikeStatus } from '../../../../../core/dto/like-status';
import { PostDocument } from '../../domain/posts.entity';

class newestLikesViewDTO {
  addedAt: string;
  userId: string | null;
  login: string | null;
}

class LikesInfoViewDto {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: newestLikesViewDTO[];
}

export class PostsViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: LikesInfoViewDto;

  static mapToView(post: PostDocument, status: LikeStatus): PostsViewDto {
    const dto = new PostsViewDto();

    dto.id = post._id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt.toISOString();
    dto.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: status ,
      newestLikes: post.extendedLikesInfo.newestLikes.map((like) => ({
        addedAt: like.addedAt,
        userId: like.userId,
        login: like.login,
      })),
    };

    return dto;
  }
}
