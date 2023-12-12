import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { Telegram } from './telegram.interface';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'
import { getTelegramConfig } from 'src/config/telegram.config';

@Injectable()
export class TelegramService {
  bot: Telegraf
  options: Telegram

  constructor() {
    this.options = getTelegramConfig()
    this.bot = new Telegraf(this.options.token)
  }
  // отправка сообщений в telegram
  async sendMessage(msg:string, options?:ExtraReplyMessage, chatId: string = this.options.chatId) {
    await this.bot.telegram.sendMessage(chatId, msg, {
      parse_mode: 'HTML',
      ...options
    })
  }
  // отправка изображений в telegram
  async sendPic(picture: string, msg?: string, chatId: string = this.options.chatId) {
    await this.bot.telegram.sendPhoto(chatId, picture, msg ? {
      caption: msg,
    } : {})
  }
}
