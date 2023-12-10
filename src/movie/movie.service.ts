import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateMovieDto } from './dto/createMovie.dto';
import { MovieModel } from './movie.model';
import { Types } from 'mongoose';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>) { }

  // поиск по полю slug
  async bySlug(slug: string) {
    const docs = await this.MovieModel.findOne({ slug }).populate('actors genres').exec()
    if (!docs) throw new NotFoundException('По этому запросу фильмы не найдены')
    return docs
  }

  // поиск по актёру
  async byActor(actorId: Types.ObjectId) {
    const docs = await this.MovieModel.find({ actors: actorId }).populate('actors genres').exec()
    if (!docs) throw new NotFoundException('Фильмы c этим актёром не найдены')
    if (docs.length === 0) throw new NotFoundException('Фильмов c этим актёром нет в базе или передан неверный id актёра')
    return docs
  }

  // поиск по полю жанру
  async byGenres(genresId: Types.ObjectId[]) {
    const docs = await this.MovieModel.find({ genres: { $in: genresId } }).populate('actors genres').exec()
    if (!docs) throw new NotFoundException('Фильмов этого жанра нет в базе')
    if (docs.length === 0) throw new NotFoundException('Фильмов этого жанра нет в базе или передан неверный id жанра')
    return docs
  }

  // получение всех актёров
  async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i')
          },
        ]
      }
    }
    return this.MovieModel.find(options).select('-updatedAt -__v').sort({
      createdAt: 'desc'
    }).exec()
  }

  // обновление счётчика кол-ва открытий фильма
  async updateCountOpened(slug: string) {
    const updateItem = await this.MovieModel.findOneAndUpdate({ slug }, {
      $inc: { countOpened: 1 },
    },
      {
        new: true,
      }
    ).exec()
    if (!updateItem) throw new NotFoundException('Фильм не найден')

    return updateItem
  }

  // получение самых популярных фильмов
  async getMostPopular() {
    return this.MovieModel.find({ countOpened: { $gt: 0 } }).sort({ countOpened: -1 }).populate('genres').exec()
  }

  // обновление рейтинга фильма
  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.MovieModel.findByIdAndUpdate(id, { rating: newRating }, { new: true })
    .exec()
  }

  // * раздел админа *

  // поиск фильма
  async byId(_id: string) {
    const movie = await this.MovieModel.findById(_id)
    if (!movie) {
      throw new NotFoundException('Этот фильм не найден');
    }
    return movie
  }

  // создание нового фильма
  async create() {
    const defaultValue: CreateMovieDto = {
      title: '',
      slug: '',
      description: '',
      bigPoster: '',
      poster: '',
      actors: [],
      genres: [],
      videoUrl: '',
    }
    const movie = await this.MovieModel.create(defaultValue)
    return movie._id
  }

  // обновление фильма
  async update(_id: string, dto: CreateMovieDto) {
    const updateItem = await this.MovieModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec()
    if (!updateItem) throw new NotFoundException('Фильм не найден')

    return updateItem
  }

  // удаление фильма
  async deleteItem(id: string) {
    const deleteItem = this.MovieModel.findByIdAndDelete(id).exec()
    if (!deleteItem) throw new NotFoundException('Фильм не найден')
    return deleteItem
  }
}