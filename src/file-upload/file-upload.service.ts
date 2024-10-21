import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload } from './entities/file-upload.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  constructor(
    @InjectRepository(FileUpload)
    private readonly fileUploadRepository: Repository<FileUpload>,
  ) {}

  async uploadFile(file: Express.Multer.File, title?: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const uploadFile = this.fileUploadRepository.create({
      title,
      file: file.path,
    });
    return await this.fileUploadRepository.save(uploadFile);
  }

  async findAllFiles() {
    const files = await this.fileUploadRepository.find();
    if (!files || files.length === 0) {
      throw new NotFoundException('No files found');
    }
    return files;
  }

  async findFileById(id: string) {
    const file = await this.fileUploadRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async deleteFile(id: string) {
    const file = await this.fileUploadRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    console.log(file);
    const filePath = path.join(file.file);
    console.log(filePath);
    if (fs.existsSync(filePath)) {
      fs.rmSync(filePath); // Delete file from the filesystem
    }

    await this.fileUploadRepository.delete(id);
    return { message: 'File deleted successfully' };
  }
}
