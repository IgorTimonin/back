import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserModel } from './user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UpdateUserDto } from './dto/updateUserDto';
import { genSalt, hash } from 'bcryptjs';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>) { }

  // поиск пользователя по id
  async byId(_id: string) {
    const user = await this.UserModel.findById(_id)
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user
    // {
    //   _id: user._id,
    //   email: user.email,
    //   isAdmin: user.isAdmin,
    //   favorites: user.favorites
    // }
  }

  // обновление данных пользователя
  async updateProfile(_id: string, dto: UpdateUserDto) {
    const user = await this.byId(_id)
    const isSameUser = await this.UserModel.findOne({ email: dto.email })

    if (isSameUser && String(_id) !== String(isSameUser._id)) {
      throw new ConflictException('Пользователь c таким email уже существует')
    }

    if (dto.password) {
      const salt = await genSalt(10);
      user.password = await hash(dto.password, salt)
    }

    user.email = dto.email
    if (dto.isAdmin || dto.isAdmin === false) {
      user.isAdmin = dto.isAdmin
    }

    await user.save()
    return
  }
  // добавление\удаление в избранное
  async toggleFavorite(movieId: Types.ObjectId, user: UserModel) {
    const { _id, favorites } = user

    await this.UserModel.findByIdAndUpdate(_id, {
      favorites: favorites.includes(movieId) ? favorites.filter(id => String(id) !== String(movieId)) : [...favorites, movieId]
    })
  }

  // получение избранного
  async getFavoritesMovies(_id: Types.ObjectId) {
    return this.UserModel.findById(_id, 'favorites').populate({
      path: 'favorites',
      populate: {
        path: 'genres',
      }
    }).exec().then((data) => data.favorites) 
  }

  // * раздел админа *

  // кол-во всех пользователей
  async getCount() {
    return this.UserModel.find().count().exec()
  }

  // получение всех профилей пользователей
  async getAllUsers(searchTerm?: string) {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [
          {
            email: new RegExp(searchTerm, 'i')
          }
        ]
      }
    }
    return this.UserModel.find(options).select('-password -updatedAt -__v').sort({
      createdAt: 'desc'
    }).exec()
  }

  // удаление пользователя
  async deleteUser(id: string) {
    return this.UserModel.findByIdAndDelete(id).exec()
  }
}
