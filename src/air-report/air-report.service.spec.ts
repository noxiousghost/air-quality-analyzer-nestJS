import { Test, TestingModule } from '@nestjs/testing';
import { AirReportService } from './air-report.service';

describe('AirReportService', () => {
  let service: AirReportService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AirReportService],
    }).compile();

    service = module.get<AirReportService>(AirReportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
