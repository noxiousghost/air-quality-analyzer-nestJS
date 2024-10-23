import { Test, TestingModule } from '@nestjs/testing';
import { ParseCsvController } from './parse-csv.controller';

describe('ParseCsvController', () => {
  let controller: ParseCsvController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParseCsvController],
    }).compile();

    controller = module.get<ParseCsvController>(ParseCsvController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
