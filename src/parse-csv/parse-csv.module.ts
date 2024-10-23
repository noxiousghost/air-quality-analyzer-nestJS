import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParseCsvService } from './parse-csv.service';
import { ParseCsvController } from './parse-csv.controller';
import { AirReport } from '../air-report/entities/air-report.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([AirReport]), FileUploadModule],
  controllers: [ParseCsvController],
  providers: [ParseCsvService],
})
export class ParseCsvModule {}
