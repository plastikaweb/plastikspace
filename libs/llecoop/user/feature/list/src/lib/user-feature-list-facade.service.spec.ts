import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { LlecoopUser } from '@plastik/llecoop/entities';
import { llecoopUserStore } from '@plastik/llecoop/user/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';

import { LlecoopUserListFacadeService } from './user-feature-list-facade.service';
import { LlecoopUserSearchFeatureTableConfig } from './user-feature-table.config';

describe('LlecoopUserListFacadeService', () => {
  let service: LlecoopUserListFacadeService;
  const confirmService = { confirm: vi.fn().mockReturnValue(of(false)) };
  const store = { filter: signal({}), delete: vi.fn() };

  beforeEach(() => {
    confirmService.confirm.mockClear();
    confirmService.confirm.mockReturnValue(of(false));
    store.delete.mockClear();

    TestBed.configureTestingModule({
      providers: [
        { provide: llecoopUserStore, useValue: store },
        {
          provide: LlecoopUserSearchFeatureTableConfig,
          useValue: { getTableDefinition: () => ({}) },
        },
        { provide: SharedConfirmDialogService, useValue: confirmService },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: VIEW_CONFIG, useValue: signal([{ name: 'user' }]) },
      ],
    });

    service = TestBed.inject(LlecoopUserListFacadeService);
  });

  it('should escape HTML in the user email interpolated into the delete confirm message', () => {
    service.onTableActionDelete({
      id: 'u1',
      email: '"<img src=x onerror=alert(1)>"@evil.test',
    } as LlecoopUser);

    expect(confirmService.confirm).toHaveBeenCalledTimes(1);
    const message = confirmService.confirm.mock.calls[0][1] as string;
    expect(message).not.toContain('<img');
    expect(message).toContain('&lt;img');
    expect(store.delete).not.toHaveBeenCalled();
  });

  it('should delete the user only after the user confirms', () => {
    confirmService.confirm.mockReturnValueOnce(of(true));

    service.onTableActionDelete({ id: 'u1', email: 'user@test.com' } as LlecoopUser);

    expect(store.delete).toHaveBeenCalledWith('u1');
  });
});
