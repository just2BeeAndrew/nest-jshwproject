import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';

import {FilterQuery} from 'mongoose';

@Injectable()
export class UsersQueryRepository {
  async getAllUsers(){

  }
}
