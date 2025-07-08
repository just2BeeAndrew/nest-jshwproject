import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class BasicAuthGuard implements CanActivate {}