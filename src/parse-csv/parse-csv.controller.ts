import { Controller, Param, Post, Res, HttpStatus, Next } from '@nestjs/common';
import { ParseCsvService } from './parse-csv.service';
import { Response, NextFunction } from 'express';
import { FileUploadService } from '../file-upload/file-upload.service';

@Controller('api/file/')
export class ParseCsvController {
  constructor(
    private readonly parseCsvService: ParseCsvService,
    private readonly uploadFileService: FileUploadService, // Injecting the service to find file details
  ) {}

  @Post('process/:id')
  async processCSVFile(
    @Param('id') fileId: string,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const file = await this.uploadFileService.findFileById(fileId);

      if (!file) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'File not found' });
      }

      const filePath = file.file; // Path to the uploaded CSV file
      const result = await this.parseCsvService.processCsvAndSaveData(filePath);

      return res.status(HttpStatus.OK).json({
        message: 'CSV file processed successfully',
        successCount: result.success,
        errors: result.errors,
      });
    } catch (error) {
      next(error);
    }
  }
}
