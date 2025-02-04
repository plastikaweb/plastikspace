import { DatePipe, PercentPipe, TitleCasePipe } from '@angular/common';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SharedUtilFormattersService } from './shared-util-formatters.service';

describe('SharedUtilFormattersService', () => {
  let service: SharedUtilFormattersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        SharedUtilFormattersService,
        TitleCasePipe,
        DatePipe,
        PercentPipe,
      ],
    });
    service = TestBed.inject(SharedUtilFormattersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
