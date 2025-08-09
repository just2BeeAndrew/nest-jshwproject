import { LikeStatus } from '../../../../../core/dto/like-status';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import {
  Status,
  StatusModelType,
} from '../../../comments/domain/status.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { StatusRepository } from '../../../comments/infrastructure/status.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';
import { Category } from '../../../../../core/dto/category';
import { UsersRepository } from '../../../../users/infrastructure/users.repository';
import { CalculateStatusCountCommand } from '../../../comments/application/usecases/calculate-status-count.usecase';
import { LikeDetails } from '../../domain/posts.entity';

export class PostLikeStatusCommand {
  constructor(
    public userId: string,
    public postId: string,
    public newStatus: LikeStatus,
  ) {}
}

@CommandHandler(PostLikeStatusCommand)
export class PostLikeStatusUseCase
  implements ICommandHandler<PostLikeStatusCommand>
{
  constructor(
    @InjectModel(Status.name) private StatusModel: StatusModelType,
    private commandBus: CommandBus,
    private statusRepository: StatusRepository,
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: PostLikeStatusCommand) {
    const user = await this.usersRepository.findById(command.userId);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not Found',
        extensions: [{ message: 'User not found', key: 'user' }],
      });
    }

    const post = await this.postsRepository.getPostByIdOrNotFoundFail(
      command.postId,
    );
    if (!post) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not found',
        extensions: [{ message: 'Post not found', key: 'post' }],
      });
    }

    const existingStatus = await this.statusRepository.findStatus(
      command.userId,
      command.postId,
      Category.Post,
    );

    const currentStatus = existingStatus
      ? existingStatus.status
      : LikeStatus.None;

    if (existingStatus) {
      if (existingStatus.status === command.newStatus) {
        return;
      } else {
        existingStatus.setStatus(command.newStatus);
        await this.statusRepository.save(existingStatus);
      }
    } else if (command.newStatus !== LikeStatus.None) {
      const status = this.StatusModel.createInstance({
        userId: command.userId,
        login: user.accountData.login,
        categoryId: command.postId,
        category: Category.Post,
        status: command.newStatus,
      });
      await this.statusRepository.save(status);
    }

    const updatedCounts =
      await this.commandBus.execute<CalculateStatusCountCommand>(
        new CalculateStatusCountCommand(
          post.extendedLikesInfo.likesCount,
          post.extendedLikesInfo.dislikesCount,
          currentStatus,
          command.newStatus,
        ),
      );

    post.setStatusCounters(
      updatedCounts.likesCount,
      updatedCounts.dislikesCount,
    );
    await this.postsRepository.save(post);

    const newestLikes: LikeDetails[] = await this.statusRepository.getNewestLikes(command.postId)

    post.setNewestLikes(newestLikes);
    await this.postsRepository.save(post);
  }
}
