import { Types } from 'mongoose';


export class CreateSessionDomainDto{
  sessionId: Types.ObjectId;
  userId:string;
  title:string;
  ip:string;
  iat:number;
  exp:number;
}