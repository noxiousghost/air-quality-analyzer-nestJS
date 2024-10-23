import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as csv from 'csv-parser';
import { Readable } from 'stream';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AirReport } from '../air-report/entities/air-report.entity';
import { ValidValuesUtil } from '../utils/validValues.util';

interface CSVRow {
  aqi: string;
  day: string;
  month: string;
  year: string;
}

@Injectable()
export class ParseCsvService {
  constructor(
    @InjectRepository(AirReport)
    private airReportRepository: Repository<AirReport>,
  ) {}

  async processCsvAndSaveData(
    filePath: string,
  ): Promise<{ success: number; errors: string[] }> {
    const results: CSVRow[] = [];
    const errors: string[] = [];
    let success = 0;

    const fileContent = await fs.readFile(filePath, 'utf-8');
    await new Promise<void>((resolve, reject) => {
      Readable.from(fileContent)
        .pipe(csv())
        .on('data', (data: CSVRow) => results.push(data))
        .on('end', () => resolve())
        .on('error', (error: string) => reject(error));
    });

    for (const row of results) {
      try {
        await this.validateAndSaveRow(row);
        success++;
      } catch (error) {
        if (error instanceof Error) {
          errors.push(`Row error: ${error.message}`);
        } else {
          errors.push('An unknown error occurred');
        }
      }
    }

    return { success, errors };
  }

  private async validateAndSaveRow(row: CSVRow): Promise<void> {
    const { aqi, day, month, year } = row;

    // Validate and normalize the month
    const normalizedMonth = ValidValuesUtil.normalizeMonth(month);
    if (!normalizedMonth) {
      throw new Error(`Invalid month: ${month}`);
    }

    // Convert string values to numeric
    const numericAqi = parseInt(aqi, 10);
    const numericDay = parseInt(day, 10);
    const numericYear = parseInt(year, 10);

    // Validate the AQI, day, and year
    if (!ValidValuesUtil.isValidAqi(numericAqi)) {
      throw new BadRequestException(`Invalid AQI: ${aqi}`);
    }
    if (
      !ValidValuesUtil.isValidDayForMonth(
        numericDay,
        normalizedMonth,
        numericYear,
      )
    ) {
      throw new BadRequestException(`Invalid day for month: ${day}`);
    }
    if (!ValidValuesUtil.isValidYear(numericYear)) {
      throw new BadRequestException(`Invalid year: ${year}`);
    }

    // Check if the record already exists in the database
    const existingRecord = await this.airReportRepository.findOne({
      where: { day: numericDay, month: normalizedMonth, year: numericYear },
    });

    if (existingRecord) {
      throw new BadRequestException(
        `Duplicate record for ${normalizedMonth} ${day}, ${year}`,
      );
    }

    // Create a new AirReport entity and save it to the database
    const airReport = this.airReportRepository.create({
      aqi: numericAqi,
      day: numericDay,
      month: normalizedMonth,
      year: numericYear,
    });

    await this.airReportRepository.save(airReport);
  }
}