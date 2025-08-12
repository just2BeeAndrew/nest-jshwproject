import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateSessionDomainDto } from './dto/create.session.domain.dto';
import {Types} from 'mongoose';
import { DomainExceptionFactory } from '../../../core/exceptions/filters/domain-exception-factory';

@Schema({ versionKey: false })
export class Session {
  @Prop({type: Types.ObjectId, required: true, auto: false})
  _id: Types.ObjectId

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

  @Prop({type: Date, nullable: true})
  deletedAt: Date | null;

  static createInstance(dto: CreateSessionDomainDto) {
    const session = new this();
    session._id = dto.sessionId
    session.userId = dto.userId;
    session.title = dto.title;
    session.ip = dto.ip;
    session.iat = dto.iat;
    session.exp = dto.exp;
    session.deletedAt = null;

    return session as SessionDocument;
  }

  setSession(iat: number, exp: number) {
    this.iat = iat;
    this.exp = exp;
  }

  softDelete() {
    if(this.deletedAt !== null) {
      throw DomainExceptionFactory.badRequest("Already Deleted", "session");
    }
    this.deletedAt = new Date();
  }

  static async clean(this: SessionModelType){
    await this.deleteMany({})
  }
}

export const SessionSchema = SchemaFactory.createForClass(Session)

SessionSchema.loadClass(Session)

export type SessionDocument = HydratedDocument<Session>

export type SessionModelType = Model<SessionDocument> & typeof Session
