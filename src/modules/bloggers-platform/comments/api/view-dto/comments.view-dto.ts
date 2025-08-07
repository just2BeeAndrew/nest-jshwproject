import { LikeStatus } from '../../../../../core/dto/like-status';
import { CommentDocument } from '../../domain/comments.entity';

class CommentatorInfoTypeViewDto {
  userId: string;
  userLogin: string;
}

class LikesInfoTypeViewDto {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus
}

export class CommentsViewDto {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoTypeViewDto;
  createdAt: Date;
  likesInfo: LikesInfoTypeViewDto;

  static mapToView(comment: CommentDocument, status: LikeStatus): CommentsViewDto {
    const dto = new CommentsViewDto();

    dto.id = comment._id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    }
    createdAt: comment.createdAt.toISOString();
    dto.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: status
    }

    return dto;
  }
}
