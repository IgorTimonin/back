import { Injectable, NotFoundException } from '@nestjs/common';
import { GenreModel } from './genre.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateGenreDto } from './dto/createGenre.dto';
import { MovieService } from 'src/movie/movie.service';
import { Collection } from './genre.interface';

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(GenreModel)
    private readonly GenreModel: ModelType<GenreModel>,
    private readonly movieService: MovieService
  ) { }

  // поиск по полю slug
  async bySlug(slug: string) {
    const doc = await this.GenreModel.findOne({ slug }).exec()
    if (!doc) throw new NotFoundException('Жанр не найден')
    return doc
  }


  // получение всех жанров
  async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [
          {
            name: new RegExp(searchTerm, 'i')
          },
          {
            slug: new RegExp(searchTerm, 'i')
          },
          {
            description: new RegExp(searchTerm, 'i')
          }
        ]
      }
    }
    return this.GenreModel.find(options).select('-updatedAt -__v').sort({
      createdAt: 'desc'
    }).exec()
  }

  // получение коллекций жанров
  async getCollections() {
    const genres = await this.getAll()
    const collections = await Promise.all(genres.map(async (genre) => {
      const moviesByGenre = await this.movieService.byGenres([genre._id])

      const result: Collection = {
        _id: String(genre._id),
        image: moviesByGenre[0].bigPoster ? moviesByGenre[0].bigPoster : '/back/uploads/no_icon.png',
        title: genre.slug,
        slug: genre.name
      }

      return result
    }))
    return collections
  }

  // * раздел админа *

  // поиск жанра
  async byId(_id: string) {
    const genre = await this.GenreModel.findById(_id)
    if (!genre) {
      throw new NotFoundException('Этот жанр не найден');
    }
    return genre
  }

  // создание нового жанра
  async create() {
    const defaultValue: CreateGenreDto = {
      name: '',
      slug: '',
      description: '',
      icon: ''
    }
    const genre = await this.GenreModel.create(defaultValue)
    return genre._id
  }

  // обновление жанра
  async update(_id: string, dto: CreateGenreDto) {
    const updateItem = await this.GenreModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec()
    if (!updateItem) throw new NotFoundException('Жанр не найден')

    return updateItem
  }


  // удаление жанра
  async deleteItem(id: string) {
    const deleteItem = this.GenreModel.findByIdAndDelete(id).exec()
    if (!deleteItem) throw new NotFoundException('Жанр не найден')
    return deleteItem
  }
}
