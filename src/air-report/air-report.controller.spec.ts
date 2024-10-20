import { Test, TestingModule } from '@nestjs/testing';
import { AirReportController } from './air-report.controller';
import { AirReportService } from './air-report.service';

describe('AirReportController', () => {
  let controller: AirReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirReportController],
      providers: [AirReportService],
    }).compile();

    controller = module.get<AirReportController>(AirReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
