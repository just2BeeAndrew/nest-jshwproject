import { LikeStatus } from '../../../../../core/dto/like-status';

class newestLikesViewDTO   {
  "addedAt":string
  "userId":string
  "login":string
}

class LikesInfoViewDto{
  "likesCount":number
  "dislikesCount":number
  "myStatus":LikeStatus
  "newestLikes": newestLikesViewDTO[]
}

export class PostsViewDto {
  "id": string
  "title":string
  "shortDescription":string
  "content": string
  "blogId": string
  "blogName":string
  "createdAt":string
  "extendedLikesInfo": LikesInfoViewDto
}
