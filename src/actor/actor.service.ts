import { Injectable, NotFoundException } from '@nestjs/common';
import { ActorModel } from './actor.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ActorDto } from './actor.dto';

@Injectable()
export class ActorService {
  constructor(@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>) { }
  // поиск по полю slug
  async bySlug(slug: string) {
    const doc = await this.ActorModel.findOne({ slug }).exec()
    if (!doc) throw new NotFoundException('Актёр не найден')
    return doc
  }


  // получение всех актёров
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
          }
        ]
      }
      return this.ActorModel.find(options).select('-updatedAt -__v').sort({
        createdAt: 'desc'
      }).exec()
    }

    // Агрегация

    return this.ActorModel.aggregate().match(options).lookup({
      from: 'Movie',
      foreignField: 'actors',
      localField: '_id',
      as: 'movies'
    }).addFields({
      countMovies: {
        $size: '$movies'
      }
    }).project({
      __v: 0,
      updatedAt: 0,
      movies: 0
    })
      .sort({
        createdAt: -1
      }).exec()
  }

  // * раздел админа *

  // поиск актёра
  async byId(_id: string) {
    const actor = await this.ActorModel.findById(_id)
    if (!actor) {
      throw new NotFoundException('Этот актёр не найден');
    }
    return actor
  }

  // создание нового актёра
  async create() {
    const defaultValue: ActorDto = {
      name: '',
      slug: '',
      photo: ''
    }
    const actor = await this.ActorModel.create(defaultValue)
    return actor._id
  }

  // обновление актёра
  async update(_id: string, dto: ActorDto) {
    const updateItem = await this.ActorModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec()
    if (!updateItem) throw new NotFoundException('Актёр не найден')

    return updateItem
  }


  // удаление актёра
  async deleteItem(id: string) {
    const deleteItem = this.ActorModel.findByIdAndDelete(id).exec()
    if (!deleteItem) throw new NotFoundException('Актёр не найден')
    return deleteItem
  }
}
