import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserModel } from './user.model';
import { UserService } from './user.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config'

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: 'User',
        },
      },
    ]),
    ConfigModule,
  ]
})
export class UserModule { }
