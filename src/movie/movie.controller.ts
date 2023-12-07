import { Controller, Get, Put, Post, Delete, Param, Query, Body, HttpCode, UsePipes, ValidationPipe } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { CreateMovieDto } from './dto/createMovie.dto';
import { ObjectId, Types } from 'mongoose';
import { GenresIdDto } from './dto/genresId.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) { }

  // получение фильма по slug
  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.movieService.bySlug(slug)
  }

  // получение фильма по актёру
  @Get('by-actor/:actorId')
  async byActor(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
    return this.movieService.byActor(actorId)
  }

  // получение фильма по жанру
  @UsePipes(new ValidationPipe())
  @Post('by-genres/')
  @HttpCode(200)
  async byGenres(
    @Body()
    { genresId }: GenresIdDto) {
    return this.movieService.byGenres(genresId)
  }

  // получение всех жанров
  @Get()
  async getAll(@Query('searchTerm') searchTerm?: string) {
    return this.movieService.getAll(searchTerm)
  }

  // получение всех жанров
  @Get('most-popular')
  async getMostPopular() {
    return this.movieService.getMostPopular()
  }

  // обновление счётчика открытия фильмов
  @Put('update-count-opened')
  @HttpCode(200)
  async updateCountOpened(
    @Body('slug') slug: string) {
    return this.movieService.updateCountOpened(slug)
  }

  // * раздел админа *

  // создание фильма
  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return this.movieService.create()
  }

  // получение фильма по id
  @Get(':id')
  @Auth('admin')
  async get(@Param('id', IdValidationPipe) id: string) {
    return this.movieService.byId(id)
  }

  // обновление фильма
  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateMovieDto) {
    return this.movieService.update(id, dto)
  }

  // удаление профиля по id
  @Delete(':id')
  @Auth('admin')
  @HttpCode(200)
  async deleteMovie(@Param('id', IdValidationPipe) id: string,) {
    return this.movieService.deleteItem(id)
  }
}
