import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { axe } from 'vitest-axe';

import { EcoAdminProvisionalViewComponent } from './eco-admin-provisional-view.component';

describe('EcoAdminProvisionalViewComponent', () => {
  let fixture: ComponentFixture<EcoAdminProvisionalViewComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    mockPocketBaseUserProfileStore.logout.mockReset();

    await TestBed.configureTestingModule({
      imports: [EcoAdminProvisionalViewComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoAdminProvisionalViewComponent);
    host = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('keeps the landmark the skip link jumps to', () => {
    const main = host.querySelector('main');

    expect(main?.id).toBe('mainContent');
    expect(main?.getAttribute('tabindex')).toBe('-1');
    expect(host.querySelector('h1')?.textContent).toContain('shell.placeholder.title');
  });

  it('closes the session and goes back to the login screen', () => {
    const navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);

    host.querySelector<HTMLButtonElement>('.provisional__logout')?.click();

    expect(mockPocketBaseUserProfileStore.logout).toHaveBeenCalledTimes(1);
    expect(navigateByUrl).toHaveBeenCalledWith('/accedir');
  });

  it('has no accessibility violations', async () => {
    expect(await axe(host)).toHaveNoViolations();
  });
});
