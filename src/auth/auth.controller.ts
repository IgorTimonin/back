import { Body, Controller, Post, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService){}

  @UsePipes(new ValidationPipe())
  @HttpCode(200) 
  @Post('signup')
  async register(@Body() dto: AuthDto ) {
    return this.AuthService.signup(dto)
  }

}
