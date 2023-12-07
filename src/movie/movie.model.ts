import { Ref, prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { ActorModel } from "src/actor/actor.model";
import { GenreModel } from "src/genre/genre.model";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MovieModel extends Base { }

export class Parameters {
  @prop()
  year: number

  @prop()
  duration: number

  @prop()
  country: string
}

export class MovieModel extends TimeStamps {
  @prop()
  title: string

  @prop()
  description: string

  @prop({unique:true})
  slug: string

  @prop()
  poster: string

  @prop()
  bigPoster: string

  @prop({ ref: () => ActorModel })
  actors: Ref<ActorModel>[]

  @prop({ ref: () => GenreModel })
  genres: Ref<GenreModel>[]

  @prop()
  parameters?: Parameters

  @prop({default:3.0})
  rating?: number

  @prop({default: 0})
  countOpened?: number

  @prop()
  videoUrl: string

  @prop({default: false})
  isSendTelegram?: boolean
}