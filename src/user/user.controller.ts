import { Body, Controller, Get, HttpCode, Param, Put, Delete, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUserDto';
import { UserService } from './user.service';
import { Types } from 'mongoose';
import { UserModel } from './user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // получение своего профиля
  @Get('profile')
  @Auth()
  async getProfile(@User('_id') _id: string) {
    return this.userService.byId(_id)
  }

  // обновление профиля пользователя
  @UsePipes(new ValidationPipe())
  @Put('profile')
  @Auth()
  @HttpCode(200)
  async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(_id, dto)
  }

  // получение избранного
  @Get('profile/favorites')
  @Auth()
  async getFavorites(@User('_id') _id: Types.ObjectId) {
    return this.userService.getFavoritesMovies(_id)
  }

  // добавление\удаление в избранное 
  @Put('profile/favorites')
  @Auth()
  @HttpCode(200)
  async updateFavorites(
    @User() user: UserModel,
    @Body('movieId', IdValidationPipe) movieId: Types.ObjectId) {
    return this.userService.toggleFavorite(movieId, user)
  }


  // * раздел админа *
  
  // обновление профиля админа
  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(@Param('id', IdValidationPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(id, dto)
  }

  // получение профиля пользователя по id
  @Get(':id')
  @Auth('admin')
  async getUserProfile(@Param('id', IdValidationPipe) id: string) {
    return this.userService.byId(id)
  }

  // получение кол-ва пользователей
  @Get('count')
  @Auth('admin')
  async getCountUsers() {
    return this.userService.getCount()
  }

  // получение всех профилей пользователей
  @Get()
  @Auth('admin')
  async getUsers(@Query('searchTerm') searchTerm?: string) {
    return this.userService.getAllUsers(searchTerm)
  }

  // удаление профиля по id
  @Delete(':id')
  @Auth('admin')
  @HttpCode(200)
  async deleteUser(@Param('id', IdValidationPipe) id: string,) {
    return this.userService.deleteUser(id)
  }
}
