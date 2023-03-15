import { IsString } from 'class-validator';

export class RefreshTokenDto {
@IsString({
  message: 'Отсутствует refresh token или он не является строкой'
})
refreshToken: string
}