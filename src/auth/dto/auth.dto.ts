import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string

  @MinLength(6, {
    message: 'Пароль должен быть длиннее 6-ти символов'
  })
  @IsString()
  password: string
}