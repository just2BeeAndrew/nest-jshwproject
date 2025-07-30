import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Status, StatusDocument, StatusModelType } from '../domain/status.entity';

@Injectable()
export class StatusRepository {
  constructor(
    @InjectModel(Status.name) private StatusModel: StatusModelType,
  ) {}

  async findStatus(userId: string, commentId: string): Promise<StatusDocument | null> {
    return this.StatusModel.findOne({userId, commentId})
  }

  async save(status: StatusDocument) {
    await status.save()
  }
}