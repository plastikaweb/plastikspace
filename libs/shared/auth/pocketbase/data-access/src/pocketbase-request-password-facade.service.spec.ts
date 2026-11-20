import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RequestPasswordData } from '@plastik/auth/entities';
import { FORM_TOKEN, FormConfig } from '@plastik/core/entities';

import {
  POCKETBASE_REQUEST_PASSWORD_SENT_URL,
  PocketBaseRequestPasswordFacadeService,
} from './pocketbase-request-password-facade.service';
import { pocketBaseUserProfileStore } from './pocketbase-user-profile.store';
import { mockPocketBaseUserProfileStore } from './pocketbase-user-profile.store.mock';

describe('PocketBaseRequestPasswordFacadeService', () => {
  const request = { email: 'member@example.test' };
  const formConfig = { getConfig: () => [] } as FormConfig<RequestPasswordData>;
  let facade: PocketBaseRequestPasswordFacadeService;
  let navigateByUrl: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockPocketBaseUserProfileStore.requestPassword.mockReset();
    mockPocketBaseUserProfileStore.requestPassword.mockResolvedValue(undefined);
    mockPocketBaseUserProfileStore.isLoading.set(false);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        PocketBaseRequestPasswordFacadeService,
        { provide: FORM_TOKEN, useValue: formConfig },
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
      ],
    });

    navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    facade = TestBed.inject(PocketBaseRequestPasswordFacadeService);
  });

  afterEach(() => {
    mockPocketBaseUserProfileStore.isLoading.set(false);
  });

  it('takes its form from the route', () => {
    expect(facade.formConfig).toBe(formConfig);
  });

  it('is busy while the store is', () => {
    expect(facade.isLoading()).toBe(false);

    mockPocketBaseUserProfileStore.isLoading.set(true);

    expect(facade.isLoading()).toBe(true);
  });

  it('asks the store with the address as typed, then shows the "email sent" screen', async () => {
    await facade.onSubmit(request);

    expect(mockPocketBaseUserProfileStore.requestPassword).toHaveBeenCalledWith(request);
    expect(navigateByUrl).toHaveBeenCalledWith(POCKETBASE_REQUEST_PASSWORD_SENT_URL);
  });

  it('shows the same screen when the request breaks, without rejecting', async () => {
    mockPocketBaseUserProfileStore.requestPassword.mockRejectedValue(new Error('network'));

    await expect(facade.onSubmit(request)).resolves.toBeUndefined();

    expect(navigateByUrl).toHaveBeenCalledWith(POCKETBASE_REQUEST_PASSWORD_SENT_URL);
  });

  it('ignores a request made while another one runs', async () => {
    mockPocketBaseUserProfileStore.isLoading.set(true);

    await facade.onSubmit(request);

    expect(mockPocketBaseUserProfileStore.requestPassword).not.toHaveBeenCalled();
    expect(navigateByUrl).not.toHaveBeenCalled();
  });
});
