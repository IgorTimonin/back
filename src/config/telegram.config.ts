import { Telegram } from "src/telegram/telegram.interface";
import { ConfigService } from '@nestjs/config';


export const getTelegramConfig = (configService: ConfigService): Telegram => ({
  chatId: '818950852',
  token: configService.get('TELEGRAM_TOKEN'),
})