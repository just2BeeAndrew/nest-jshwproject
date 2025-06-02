import { UserDocument } from '../../domain/users.entity';

export class UsersViewDto {
  id: string;
  login: string;
  email: string;
  createdAt: Date;

  static mapToView(User: UserDocument): UsersViewDto {
    const dto = new UsersViewDto();

    dto.id = dto.id;
    dto.login = dto.login;
    dto.email = dto.email;
    dto.createdAt = dto.createdAt;

    return dto;
  }
}
