import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';
import { LikeStatus } from '../../../../../core/dto/like-status';
import { StatusRepository } from '../../infrastructure/status.repository';
import { Status, StatusModelType } from '../../domain/status.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CalculateStatusCountCommand } from './calculate-status-count.usecase';

export class LikeStatusCommand {
  constructor(
    public userId: string,
    public commentId: string,
    public newStatus: LikeStatus,
  ) {}
}

@CommandHandler(LikeStatusCommand)
export class LikeStatusUseСase implements ICommandHandler<LikeStatusCommand> {
  constructor(
    @InjectModel(Status.name) private StatusModel: StatusModelType,
    private commandBus: CommandBus,
    private commentsRepository: CommentsRepository,
    private statusRepository: StatusRepository,
  ) {}

  async execute(command: LikeStatusCommand) {
    const comment = await this.commentsRepository.findCommentById(
      command.commentId,
    );
    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not found',
        extensions: [{ message: 'Comment not found', key: 'comment' }],
      });
    }

    const existingStatus = await this.statusRepository.findStatus(
      command.userId,
      command.commentId,
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
        commentId: command.commentId,
        status: command.newStatus,
      });
      await this.statusRepository.save(status);
    }

    const updatedCounts =
      await this.commandBus.execute<CalculateStatusCountCommand>(
        new CalculateStatusCountCommand(
          comment.likesInfo.likesCount,
          comment.likesInfo.dislikesCount,
          currentStatus,
          command.newStatus,
        ),
      );

    comment.setStatusCounters(
      updatedCounts.likesCount,
      updatedCounts.dislikesCount,
    );
    await this.commentsRepository.save(comment);
  }
}
