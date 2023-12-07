import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from "class-validator";

export class Parameters {
  @IsNumber()
  year: number

  @IsNumber()
  duration: number

  @IsNumber()
  country: string
}

export class CreateMovieDto {

  @IsString()
  title: string

  @IsString()
  description: string

  @IsString()
  slug: string

  @IsString()
  poster: string

  @IsString()
  bigPoster: string

  @IsArray()
  @IsString({ each: true })
  actors: string[]

  @IsArray()
  @IsString({ each: true })
  genres: string[]

  @IsObject()
  parameters?: Parameters

  @IsString()
  videoUrl: string

  @IsBoolean()
  isSendTelegram?: boolean
}