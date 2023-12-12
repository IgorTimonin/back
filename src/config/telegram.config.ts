import { Telegram } from "src/telegram/telegram.interface";
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService

export const getTelegramConfig = (): Telegram => ({
  chatId: '818950852',
  token: configService.get('TELEGRAM_TOKEN'),
})