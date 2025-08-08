import { LikeStatus } from '../../../../../core/dto/like-status';
import { Category } from '../../../../../core/dto/category';

export class CreateStatusDomainDto {
  userId: string;
  login?: string;
  categoryId: string;
  category: Category;
  status: LikeStatus;
}