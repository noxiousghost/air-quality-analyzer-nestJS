import { Module } from '@nestjs/common';
import { AirReportService } from './air-report.service';
import { AirReportController } from './air-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirReport } from './entities/air-report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirReport])],
  controllers: [AirReportController],
  providers: [AirReportService],
})
export class AirReportModule {}
