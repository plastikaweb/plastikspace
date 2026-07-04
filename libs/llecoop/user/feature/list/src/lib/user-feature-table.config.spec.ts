import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { LlecoopUser } from '@plastik/llecoop/entities';
import { llecoopUserStore } from '@plastik/llecoop/user/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { DEFAULT_TABLE_CONFIG, TableDefinition } from '@plastik/shared/table/entities';

import { LlecoopUserSearchFeatureTableConfig } from './user-feature-table.config';

describe('LlecoopUserSearchFeatureTableConfig', () => {
  const confirmService = { confirm: vi.fn().mockReturnValue(of(false)) };
  const store = {
    sorting: signal(['name', 'asc']),
    pagination: signal({ pageIndex: 0, pageSize: 10 }),
    entities: signal([]),
    count: signal(0),
    setAdmin: vi.fn(),
  };
  let definition: TableDefinition<LlecoopUser>;

  beforeEach(() => {
    confirmService.confirm.mockClear();
    confirmService.confirm.mockReturnValue(of(false));
    store.setAdmin.mockClear();

    TestBed.configureTestingModule({
      providers: [
        { provide: llecoopUserStore, useValue: store },
        { provide: SharedConfirmDialogService, useValue: confirmService },
        { provide: DEFAULT_TABLE_CONFIG, useValue: {} },
      ],
    });

    definition = TestBed.runInInjectionContext(() =>
      TestBed.inject(LlecoopUserSearchFeatureTableConfig).getTableDefinition()
    );
  });

  it('should escape HTML in the user name interpolated into the SET_ADMIN confirm message', () => {
    definition.actions?.['SET_ADMIN']?.execute?.({
      id: 'u1',
      name: '<img src=x onerror=alert(1)>',
      email: 'user@test.com',
      registered: true,
      emailVerified: true,
      isAdmin: false,
    } as LlecoopUser);

    expect(confirmService.confirm).toHaveBeenCalledTimes(1);
    const message = confirmService.confirm.mock.calls[0][1] as string;
    expect(message).not.toContain('<img');
    expect(message).toContain('&lt;img');
    expect(store.setAdmin).not.toHaveBeenCalled();
  });

  it('should set admin only after the user confirms', () => {
    confirmService.confirm.mockReturnValueOnce(of(true));

    definition.actions?.['SET_ADMIN']?.execute?.({
      id: 'u1',
      name: 'Sòcia',
      email: 'user@test.com',
      registered: true,
      emailVerified: true,
      isAdmin: false,
    } as LlecoopUser);

    expect(store.setAdmin).toHaveBeenCalledWith({ id: 'u1' });
  });
});
