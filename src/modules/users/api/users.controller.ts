import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/query/users.query-repository';
import { UsersViewDto } from './view-dto/users.view-dto';
import { UsersService } from '../application/users.service';
import { CreateUserInputDto } from './input-dto/create-users.input-dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { BasicAuthGuard } from '../../../core/guards/basic/basic-auth.guard';
import { ApiBasicAuth } from '@nestjs/swagger';

@Controller('users')
@UseGuards(BasicAuthGuard)
@ApiBasicAuth('basicAuth')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}

  @Get()
  @HttpCode(200)
  async getAllUsers(
    @Query() query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UsersViewDto[]>> {
    return this.usersQueryRepository.getAllUsers(query);
  }

  @Post()
  @HttpCode(201)
  async createUser(@Body() body: CreateUserInputDto): Promise<UsersViewDto> {
    const userId = await this.usersService.AdminCreateUser(body);

    return this.usersQueryRepository.getByIdOrNotFoundFail(userId);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
