import { ConfigService } from '@nestjs/config/dist';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJWTCOnfig = async (configService: ConfigService): Promise<JwtModuleOptions> => ({
  secret: configService.get('JWT_SECRET'),
});