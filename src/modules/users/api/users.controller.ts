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


@Controller('user-accounts')
export class UsersController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private usersService: UsersService,
  ) {}

  @Get()
  async getAllUsers(@Query() query: any){
    return this.usersQueryRepository.getAllUsers()
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
