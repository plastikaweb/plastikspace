// eslint-disable-next-line @nx/enforce-module-boundaries
import '@plastik/shared/testing';

import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { LlecoopCategoryFireService } from './category-fire.service';

describe('LlecoopCategoryFireService', () => {
  let service: LlecoopCategoryFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: LlecoopCategoryFireService,
          useValue: {
            getAll: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(LlecoopCategoryFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
