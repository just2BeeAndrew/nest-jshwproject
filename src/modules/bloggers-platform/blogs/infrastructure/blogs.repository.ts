import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../../../users/domain/users.entity';
import { BlogDocument } from '../domain/blogs.entity';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async save(blog: BlogDocument){
    await blog.save();
  }
}
