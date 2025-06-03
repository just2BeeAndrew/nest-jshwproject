import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {UsersQueryRepository} from '../infrastructure/query/users.query-repository';
import {UsersViewDto} from './view-dto/users.view-dto';
import {UsersService} from '../application/users.service';
import { CreateUserInputDto} from './input-dto/users.input-dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';


@Controller('user-accounts')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}

  @Get()
  async getAllUsers(@Query() query: GetUsersQueryParams): Promise<PaginatedViewDto<UsersViewDto[]>> {
    return this.usersQueryRepository.getAllUsers(query)
  }

  @Post()
  async createUser(@Body() body: CreateUserInputDto):Promise<UsersViewDto{
    const userId = await this.usersService
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string){
    return this.usersService.deleteUser(id)
  }
}
