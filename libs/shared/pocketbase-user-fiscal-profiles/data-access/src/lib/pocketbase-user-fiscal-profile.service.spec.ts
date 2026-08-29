import { TestBed } from '@angular/core/testing';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { POCKETBASE_ENVIRONMENT } from '@plastik/core/environments';
import { describe, expect, it } from 'vitest';

import { PocketBaseUserFiscalProfileService } from './pocketbase-user-fiscal-profile.service';

describe('PocketBaseUserFiscalProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: POCKETBASE_INSTANCE, useValue: mockPocketBase },
        { provide: POCKETBASE_ENVIRONMENT, useValue: { production: false, environment: 'test' } },
      ],
    });
  });

  it('targets the user_fiscal_profiles collection', () => {
    const service = TestBed.inject(PocketBaseUserFiscalProfileService);

    expect(service['collectionName']()).toBe('user_fiscal_profiles');
  });
});
