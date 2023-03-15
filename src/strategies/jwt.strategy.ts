import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';
import { UserModel } from 'src/user/user.model';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService, @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel> ) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: true,
        secretKey: configService.get('JWT_SECRET')
      })
    }

  async validate({ _id }: Pick<UserModel, '_id'>) {
      return this.UserModel.findById(_id).exec()
    }
  }