import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LlecoopProductFireService } from './product-fire.service';

describe('LlecoopProductFireService', () => {
  let service: LlecoopProductFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        {
          provide: LlecoopProductFireService,
          useValue: {
            getAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(LlecoopProductFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
