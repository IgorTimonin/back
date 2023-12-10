import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { RatingModel } from './rating.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { MovieService } from 'src/movie/movie.service';
import { Types } from 'mongoose';
import { SetRatingDto } from './setRating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(RatingModel)
    private readonly RatingModel: ModelType<RatingModel>,
    private readonly movieService: MovieService) { }

  // получение рейтинга фильмов
  async getMovieValueByUser(movieId: Types.ObjectId, userId: Types.ObjectId) {
    return this.RatingModel.findOne({ movieId, userId })
      .select('value')
      .exec()
      .then((data) => (data ? data.value : 0))
  }

  // подсчёт среднего рейтинга
  async averageRatingByMovie(movieId: Types.ObjectId | string) {
    const ratingMovie: RatingModel[] = await this.RatingModel.aggregate().match({
      movieId: new Types.ObjectId(movieId)
    }).exec()

    return ratingMovie.reduce((acc, item) => acc + item.value, 0) / ratingMovie.length
  }

  // изменение рейтинга
  async setRating(userId: Types.ObjectId, dto: SetRatingDto) {
    const { movieId, value } = dto
    const newRating = await this.RatingModel.findOneAndUpdate({
      movieId, userId
    }, {
      movieId, userId, value
    }, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }).exec()

    const averageRating = await this.averageRatingByMovie(movieId)

    await this.movieService.updateRating(movieId, averageRating)

    return newRating
  }
}
