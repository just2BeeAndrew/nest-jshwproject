import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDocument, SessionModelType } from '../domain/sessions.entity';
import { Types } from 'mongoose';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  async findSessionById(sessionId: string) {
    return this.SessionModel.findOne({
      _id: new Types.ObjectId(sessionId),
      deletedAt: null
    })
  }

  async save(session: SessionDocument){
    await session.save();
  }
}
