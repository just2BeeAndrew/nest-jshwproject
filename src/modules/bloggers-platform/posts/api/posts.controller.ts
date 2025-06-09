import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor() {}

  @Get(':postId')
  async getCommentsByPostId() {}

  @Get()
  async getAllPosts() {}

  @Post()
  async createPost() {}

  @Get(':id')
  async getPostById(@Param('id') id: string) {}

  @Put(':id')
  async updatePost(@Param('id') id: string) {}

  @Delete(':id')
  async deletePost(@Param('id') id: string) {}
}
