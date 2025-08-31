import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModelType } from '../../domain/sessions.entity';
import { SessionsViewDto } from '../../api/view-dto/sessions.view-dto';

@Injectable()
export class SessionsQueryRepository {
  constructor(
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  async getAllSessions(userId: string): Promise<SessionsViewDto[]> {
    const sessions = await this.SessionModel.find({ userId: userId }).exec();

    const sessionDtos = sessions.map((session) =>
      SessionsViewDto.mapToView(session),
    );

    return sessionDtos;
  }
}
