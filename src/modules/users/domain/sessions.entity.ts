import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateSessionDomainDto } from './dto/create.session.domain.dto';

@Schema({ versionKey: false })
export class Session {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: Number, required: true })
  iat: number;

  @Prop({ type: Number, required: true })
  exp: number;

  static createInstance(dto: CreateSessionDomainDto) {
    const session = new this();
    session.userId = dto.userId;
    session.title = dto.title;
    session.ip = dto.ip;
    session.iat = dto.iat;
    session.exp = dto.exp;

    return session as SessionDocument;
  }
}

export const SessionSchema = SchemaFactory.createForClass(Session)

SessionSchema.loadClass(Session)

export type SessionDocument = HydratedDocument<Session>

export type SessionModelType = Model<SessionDocument> & typeof Session
