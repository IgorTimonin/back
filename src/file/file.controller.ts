import { Controller, Post, HttpCode, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileService } from './file.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  // получение файла
  @Post()
  @HttpCode(200)
  @Auth('admin')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, 
  @Query('folder') folder?: string) {
    return this.fileService.saveFiles([file], folder)
  }
}
