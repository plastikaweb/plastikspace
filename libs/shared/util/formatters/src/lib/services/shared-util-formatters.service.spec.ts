import { DatePipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { SharedUtilsFormattersService } from './shared-util-formatters.service';

describe('SharedFormattersUtilsService', () => {
  let service: SharedUtilsFormattersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [SharedUtilsFormattersService, TitleCasePipe, DatePipe, PercentPipe],
    });
    service = TestBed.inject(SharedUtilsFormattersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
