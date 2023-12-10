import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { Telegram } from './telegram.interface';
import { getTelegramConfig } from 'src/config/telegram.config';

@Injectable()
export class TelegramService {
  bot: Telegraf
  options: Telegram

  constructor() {
    this.options = getTelegramConfig()
    this.bot = new Telegraf(this.options.token)
  }
}
