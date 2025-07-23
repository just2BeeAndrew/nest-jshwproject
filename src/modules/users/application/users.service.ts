import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../domain/users.entity';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { BcryptService } from '../../bcrypt/application/bcrypt.service';
import { DomainException } from '../../../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../../../core/exceptions/filters/domain-exception-codes';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
  ) {}

  async AdminCreateUser(dto: CreateUserDto): Promise<string> {
    const user = await this.createUser(dto)

    user.setConfirmation()

    return user._id.toString();

  }

  async createUser(dto: CreateUserDto): Promise<UserDocument> {

    const isLoginTaken = await this.usersRepository.findByLogin(dto.login);
    if (isLoginTaken) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Login already taken ',
      });
    }

    const isEmailTaken = await this.usersRepository.findByEmail(dto.email);
    if (isEmailTaken) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email already taken ',
      });
    }

    const passwordHash = await this.bcryptService.createHash(dto.password);
    const user = this.UserModel.createInstance({
      login: dto.login,
      email: dto.email,
      passwordHash: passwordHash,
    });

    await this.usersRepository.save(user);

    return user;
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOrNotFoundFail(id);

    user.makeDeleted();

    console.log(user);

    await this.usersRepository.save(user);
  }
}
