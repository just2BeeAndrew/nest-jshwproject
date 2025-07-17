import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../../../modules/users/application/auth.service';
import { UserContextDto } from '../../../modules/users/guards/dto/user-context.dto';
import { DomainException } from '../../exceptions/domain-exception';
import { DomainExceptionCode } from '../../exceptions/filters/domain-exception-codes';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(login: string, password: string): Promise<UserContextDto> {
    const user = await this.authService.validateUser(login, password);
    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'Invalid login or password',
      });
    }

    return user;
  }
}