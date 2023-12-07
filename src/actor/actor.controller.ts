import { Controller, Get, Put, Post, Delete, Param, Query, Body, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common';
import { ActorService } from './actor.service';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { ActorDto } from './actor.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('actors')
export class ActorController {
  constructor(private readonly actorService: ActorService) { }
  
  // получение жанра по slug
  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.actorService.bySlug(slug)
  }

  // получение всех жанров
  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.actorService.getAll(searchTerm)
  }

  // * раздел админа *

  // создание жанра
  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return this.actorService.create()
  }

  // получение жанра по id
  @Get(':id')
  @Auth('admin')
  async get(@Param('id', IdValidationPipe) id: string) {
    return this.actorService.byId(id)
  }

  // обновление жанра
  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: ActorDto) {
    return this.actorService.update(id, dto)
  }

  // удаление профиля по id
  @Delete(':id')
  @Auth('admin')
  @HttpCode(200)
  async deleteGenre(@Param('id', IdValidationPipe) id: string,) {
    return this.actorService.deleteItem(id)
  }
}
