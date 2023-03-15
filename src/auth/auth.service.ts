import { Injectable } from '@nestjs/common';
import { BadRequestException, UnauthorizedException } from '@nestjs/common/exceptions';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { compare, genSalt, hash } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from 'src/user/user.model';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    private readonly jwtService: JwtService
  ) { }

  async login(dto: AuthDto) {
    return this.validateUser(dto)
  }

  async signup(dto: AuthDto) {
    const existingUser = await this.UserModel.findOne({ email: dto.email })
    if (existingUser) {
      throw new BadRequestException('Пользователь c такой почтой уже существует')
    }

    const salt = await genSalt(10)
    const newUser = new this.UserModel({
      email: dto.email,
      password: await hash(dto.password, salt)
    })

    return newUser.save()
  }

  async validateUser(dto: AuthDto): Promise<UserModel> {
    const user = await this.UserModel.findOne({ email: dto.email })
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден')
    }

    const isValidPassword = await compare(dto.password, user.password)
    if (!isValidPassword) {
      throw new UnauthorizedException('Неверный пароль')
    }
    return user
  }

  async issueTokensPair(userId: string) {
    const data = { _id: userId }

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d'
    })

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h'
    })

    return { refreshToken, accessToken }
  }
}
