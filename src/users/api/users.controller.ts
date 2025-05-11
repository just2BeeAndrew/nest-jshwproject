import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from '../application/users.service';

@Controller("users")
export class UsersController {
  constructor(protected usersService: UsersService) {}
  @Get()
  getAllUsers(){
    return this.usersService.findUsers()

  }

  @Post()
  createUser(@Body() inputModel: UserInputType){

  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string){
    return
  }

}

type UserInputType = {
  login: string,
  password: string,
  email: string,
}