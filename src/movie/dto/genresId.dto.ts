import { IsNotEmpty, MinLength } from "class-validator";
import { Types } from "mongoose";

export class GenresIdDto {
  @IsNotEmpty()
  @MinLength(24, { each:true })
  genresId: Types.ObjectId[]
}