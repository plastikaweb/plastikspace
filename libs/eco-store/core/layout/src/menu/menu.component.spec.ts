import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments';
import { EcoStoreTenantBaseService } from '@plastik/eco-store/tenant';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        ...provideEnvironmentPocketBaseTranslationMock(),
        {
          provide: POCKETBASE_INSTANCE,
          useValue: {
            collection: jest.fn().mockReturnThis(),
            authWithPassword: jest.fn(),
            authStore: {
              clear: jest.fn(),
              isValid: false,
              record: null,
            },
          },
        },
        {
          provide: EcoStoreTenantBaseService,
          useValue: {
            tenant: signal(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
