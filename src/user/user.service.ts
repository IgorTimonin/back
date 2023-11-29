import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserModel } from './user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UpdateUserDto } from './dto/updateUserDto';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>) { }

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
}
