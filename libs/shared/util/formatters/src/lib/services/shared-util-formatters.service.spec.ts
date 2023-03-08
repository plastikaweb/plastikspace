import { DatePipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { SharedUtilFormattersService } from './shared-util-formatters.service';

describe('SharedFormattersshared-util-objectsService', () => {
  let service: SharedUtilFormattersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [SharedUtilFormattersService, TitleCasePipe, DatePipe, PercentPipe],
    });
    service = TestBed.inject(SharedUtilFormattersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
