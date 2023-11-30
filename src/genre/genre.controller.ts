import { Controller, Get, Put, Post, Delete, Param, Query, Body, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common';
import { GenreService } from './genre.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { CreateGenreDto } from './dto/createGenre.dto';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) { }

  // получение жанра по slug
  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.genreService.bySlug(slug)
  }

  // получение коллекций
  @Get('/collections')
  async getCollections() {
    return this.genreService.getCollections()
  }

  // получение всех жанров
  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.genreService.getAll(searchTerm)
  }

  // * раздел админа *

  // создание жанра
  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return this.genreService.create()
  }

  // получение жанра по id
  @Get(':id')
  @Auth('admin')
  async get(@Param('id', IdValidationPipe) id: string) {
    return this.genreService.byId(id)
  }

  // обновление жанра
  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateGenreDto) {
    return this.genreService.update(id, dto)
  }

  // удаление профиля по id
  @Delete(':id')
  @Auth('admin')
  @HttpCode(200)
  async deleteGenre(@Param('id', IdValidationPipe) id: string,) {
    return this.genreService.deleteItem(id)
  }
}
