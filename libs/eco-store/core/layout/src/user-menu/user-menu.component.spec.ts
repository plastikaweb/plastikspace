import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { mockPocketBase } from '@plastik/core/api-pocketbase/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { EcoUserMenuComponent } from './user-menu.component';

describe('EcoUserMenuComponent', () => {
  let component: EcoUserMenuComponent;
  let fixture: ComponentFixture<EcoUserMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoUserMenuComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        ...provideEnvironmentPocketBaseTranslationMock(),
        {
          provide: POCKETBASE_INSTANCE,
          useValue: mockPocketBase,
        },
        {
          provide: pocketBaseUserProfileStore,
          useValue: mockPocketBaseUserProfileStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoUserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose user menu view child', () => {
    expect(component.menu()).toBeTruthy();
  });

  it('should emit logoutEvent when logout method is called', () => {
    const logoutSpy = vi.spyOn(component.logoutEvent, 'emit');

    component.logout();

    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });
});
