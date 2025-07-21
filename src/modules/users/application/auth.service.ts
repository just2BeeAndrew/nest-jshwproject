import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { JwtService } from '@nestjs/jwt';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { BcryptService } from '../../bcrypt/application/bcrypt.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from './users.service';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../../notifications/application/email.service';
import { DomainException } from '../../../core/exceptions/domain-exception';
import { DomainExceptionCode } from '../../../core/exceptions/filters/domain-exception-codes';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private bcryptService: BcryptService,
    private emailService: EmailService,
  ) {}

  async validateUser(
    login: string,
    password: string,
  ): Promise<UserContextDto | null> {
    const user = await this.usersRepository.findByLogin(login);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.bcryptService.comparePassword({
      password: password,
      hash: user.accountData.passwordHash,
    });

    if (!isPasswordValid) {
      return null;
    }

    return { id: user._id.toString() };
  }

  async login(userId: string) {
    const accessToken = this.jwtService.sign({ id: userId } as UserContextDto);

    return { accessToken };
  }

  async passwordRecovery(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Email not found',
      });
    }

    const recoveryCode = uuidv4();

    user.setRecoveryCode(recoveryCode);
    await this.usersRepository.save(user);

    await this.emailService
      .sendRecoveryPasswordEmail(email, recoveryCode)
      .catch(console.error);
  }

  async registrationConfirmation(code: string) {
    const user = await this.usersRepository.findUserByConfirmationCode(code);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User not found',
      });
    }

    if (user.emailConfirmation.isConfirmed) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'User already confirmed',
      });
    }

    if (user.emailConfirmation.confirmationCode !== code) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Invalid confirmation code',
      });
    }

    if (user.emailConfirmation.expirationDate < new Date()) {
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: 'Invalid confirmation code',
      });
    }

    user.setConfirmation();
    await this.usersRepository.save(user);
  }

  async registration(dto: CreateUserDto) {
    const createdUserId = await this.usersService.createUser(dto);

    const confirmCode = uuidv4();

    const user = await this.usersRepository.findOrNotFoundFail(createdUserId);

    user.setConfirmationCode(confirmCode);
    await this.usersRepository.save(user);

    this.emailService
      .sendConfirmationEmail(user.accountData.email, confirmCode)
      .catch(console.error);
  }
}
