import { Test, TestingModule } from '@nestjs/testing';
import { ParseCsvService } from './parse-csv.service';

describe('ParseCsvService', () => {
  let service: ParseCsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParseCsvService],
    }).compile();

    service = module.get<ParseCsvService>(ParseCsvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
