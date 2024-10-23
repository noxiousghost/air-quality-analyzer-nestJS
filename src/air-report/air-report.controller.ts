import {
  Controller,
  Get,
  Post,
  Body,
  Logger,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AirReportService } from './air-report.service';
import { CreateAirReportDto } from './dto/create-air-report.dto';
import { Response } from 'express';

@Controller('api/report')
export class AirReportController {
  private readonly logger = new Logger(AirReportService.name);
  constructor(private readonly airReportService: AirReportService) {}

  @Post('add')
  async create(
    @Body() createAirReportDto: CreateAirReportDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const result = await this.airReportService.create(createAirReportDto);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Report created successfully', result });
    } catch (error) {
      this.logger.error('Error creating report', error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get('')
  async findAll(@Res() res: Response) {
    try {
      const result = await this.airReportService.findAll();
      console.log(result);
      return res.json(result);
    } catch (error) {
      this.logger.error('Error creating report', error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get('aqi')
  async getAQIReport(
    @Query('year') year: string,
    @Res() res: Response,
    @Query('month') month?: string,
  ): Promise<Response> {
    try {
      const numericYear = parseInt(year, 10);
      if (!year || isNaN(numericYear)) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Year is required and should be a valid number.' });
      }
      const result = await this.airReportService.getAQIReport(
        month,
        numericYear,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      this.logger.error('Error generating AQI report', error);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
