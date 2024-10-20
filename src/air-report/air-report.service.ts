import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateAirReportDto } from './dto/create-air-report.dto';
import { Repository } from 'typeorm';
import { AirReport } from './entities/air-report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidValuesUtil } from '../utils/validValues.util';

@Injectable()
export class AirReportService {
  private readonly logger = new Logger(AirReportService.name);
  constructor(
    @InjectRepository(AirReport)
    private readonly airReportRepository: Repository<AirReport>,
  ) {}
  async create(airData: CreateAirReportDto): Promise<AirReport> {
    const { aqi, day, month, year, savedDate } = airData;
    // Validate month
    const normalizedMonth = ValidValuesUtil.normalizeMonth(month);
    if (!normalizedMonth) {
      throw new BadRequestException('Invalid month');
    }
    // Validate AQI
    if (!ValidValuesUtil.isValidAqi(aqi)) {
      throw new BadRequestException('Invalid AQI');
    }
    // Validate day based on month and year
    if (!ValidValuesUtil.isValidDayForMonth(day, normalizedMonth, year)) {
      throw new BadRequestException('Invalid Day');
    }
    // Validate year
    if (!ValidValuesUtil.isValidYear(year)) {
      throw new BadRequestException('Invalid Year');
    }
    // Check if a report already exists for the given day, month, and year
    const existingReport = await this.airReportRepository.findOne({
      where: {
        day,
        month: normalizedMonth,
        year,
      },
    });
    if (existingReport) {
      throw new BadRequestException(
        'Details for that particular date already exist',
      );
    }
    // Create the new report entity
    const airReport = this.airReportRepository.create({
      aqi,
      day,
      month: normalizedMonth,
      year,
      savedDate: savedDate || new Date(),
    });
    // Save the report to the database
    const result = await this.airReportRepository.save(airReport);
    if (!result) {
      throw new BadRequestException('Values not saved');
    }
    this.logger.log('New report created');
    return result;
  }

  async findAll() {
    const result = await this.airReportRepository.find({});
    if (!result) {
      throw new BadRequestException('Unknown Error');
    }
    if (result.length === 0) {
      throw new BadRequestException('No data found');
    }
    return result;
  }

  // Service to generate AQI report for a specific month and year
  async getAQIReport(month: string, year: number): Promise<any> {
    // Validate the inputs
    const normalizedMonth = ValidValuesUtil.normalizeMonth(month);
    if (!normalizedMonth) {
      throw new BadRequestException('Invalid month');
    }
    if (!ValidValuesUtil.isValidYear(year)) {
      throw new BadRequestException('Invalid year');
    }

    // Custom query to retrieve the AQI report for the month and year
    const airReports = await this.airReportRepository
      .createQueryBuilder('air_report')
      .where('air_report.month = :month', { month: normalizedMonth })
      .andWhere('air_report.year = :year', { year })
      .orderBy('air_report.day', 'ASC')
      .getMany();

    if (airReports.length === 0) {
      throw new BadRequestException('No data found for this period.');
    }

    // Calculate avg, max, min, and prepare the list of reports
    const totalAqi = airReports.reduce((sum, report) => sum + report.aqi, 0);
    const avgAqi = Math.round(totalAqi / airReports.length);
    const maxAqi = Math.max(...airReports.map((report) => report.aqi));
    const minAqi = Math.min(...airReports.map((report) => report.aqi));

    const reportList = airReports.map((report) => ({
      date: `${report.day.toString().padStart(2, '0')}/${normalizedMonth}/${report.year}`,
      aqi: report.aqi,
    }));

    // Return the report object
    return {
      month: normalizedMonth,
      year,
      avg: avgAqi,
      max: maxAqi,
      min: minAqi,
      list: reportList,
    };
  }
}
