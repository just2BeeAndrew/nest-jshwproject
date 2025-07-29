import { CommentsRepository } from '../../infrastructure/comments.repository';
import { LikesStatusDto } from '../../api/input-dto/likes-status.input-dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainException } from '../../../../../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../../../../../core/exceptions/filters/domain-exception-codes';

export class LikeStatusCommand {
  constructor(
    public userId: string,
    public commentId: string,
    public status: LikesStatusDto,
  ) {}
}

@CommandHandler(LikeStatusCommand)
export class LikeStatusUseСase implements ICommandHandler<LikeStatusCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: LikeStatusCommand) {
    const comment = await this.commentsRepository.findCommentById(
      command.commentId,
    );
    if (!comment) {
      throw new DomainException({
        code: DomainExceptionCode.NotFound,
        message: 'Not found',
        extensions:[{message: "Comment not found", key: 'comment'}],
      });
    }

    const existingLike = await this.commentsRepository.findStatus(command.userId, command.commentId);
  }
}
