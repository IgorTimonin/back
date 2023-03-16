import { Injectable, NotFoundException } from '@nestjs/common';
import { UserModel } from './user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>) { }

  async byId(_id: string) {
    const user = await this.UserModel.findById(_id)
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      favorites: user.favorites
    }
  }
}
