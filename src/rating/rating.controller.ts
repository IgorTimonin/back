import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { RatingService } from './rating.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Types } from 'mongoose';
import { User } from 'src/user/decorators/user.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { SetRatingDto } from './setRating.dto';

@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) { }

  // получение фильма по slug
  @Get(':movieId')
  @Auth()
  async getMovieValueByUser(@Param('movieId', IdValidationPipe) movieId: Types.ObjectId, @User('_id') _id: Types.ObjectId) {
    return this.ratingService.getMovieValueByUser(movieId, _id)
  }

  // получение фильма по жанру
  @UsePipes(new ValidationPipe())
  @Post('set-rating')
  @HttpCode(200)
  @Auth()
  async setRating(
    @User('_id') _id: Types.ObjectId,
    @Body() dto: SetRatingDto) {
    return this.ratingService.setRating(_id, dto)
  }
}
