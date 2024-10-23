import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../configs/multer.config';
import { Response } from 'express';

@Controller('api/file')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Res() res: Response,
  ) {
    const savedFile = await this.fileUploadService.uploadFile(file, title);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'File Uploaded', savedFile });
  }

  @Get()
  async getAllFiles(@Res() res: Response) {
    const files = await this.fileUploadService.findAllFiles();
    return res.status(HttpStatus.OK).json(files);
  }

  @Get(':id')
  async getFileById(@Param('id') id: string, @Res() res: Response) {
    const file = await this.fileUploadService.findFileById(id);
    return res.status(HttpStatus.OK).json(file);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string, @Res() res: Response) {
    await this.fileUploadService.deleteFile(id);
    return res
      .status(HttpStatus.NO_CONTENT)
      .json({ message: 'File deleted successfully' });
  }
}
