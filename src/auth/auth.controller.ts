import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly AuthService: AuthService){}

  @Post('signup')
  async register(@Body() dto: any ) {
    return this.AuthService.signup(dto)
  }

}
