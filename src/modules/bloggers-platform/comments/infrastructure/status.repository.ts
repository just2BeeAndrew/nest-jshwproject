import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Status,
  StatusDocument,
  StatusModelType,
} from '../domain/status.entity';
import { Category } from '../../../../core/dto/category';

@Injectable()
export class StatusRepository {
  constructor(@InjectModel(Status.name) private StatusModel: StatusModelType) {}

  async findStatus(
    userId: string,
    categoryId: string,
    category: Category,

  ): Promise<StatusDocument | null> {
    return this.StatusModel.findOne({
      userId:userId,
      categoryId:category,
      category: category
    });
  }

  async save(status: StatusDocument) {
    await status.save();
  }
}
