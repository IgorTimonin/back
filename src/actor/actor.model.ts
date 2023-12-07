import { prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ActorModel extends Base { }
export class ActorModel extends TimeStamps {
  @prop()
  name: string

  @prop({ unique: true })
  slug: string

  @prop({})
  photo: string
}