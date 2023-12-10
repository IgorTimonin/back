import { IsNumber } from "class-validator";
import { IsObjectId } from "class-validator-mongo-object-id";
import { Types } from "mongoose";

export class SetRatingDto{
  @IsObjectId({message: 'Неверный id фильма'})
  movieId: Types.ObjectId

  @IsNumber()
  value: number
}