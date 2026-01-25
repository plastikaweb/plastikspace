import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { ecoStoreTenantStoreMock } from '@plastik/eco-store/tenant/testing';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import LayoutComponent from './layout.component';
import { MenuComponent } from './menu/menu.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LayoutComponent,
        HeaderComponent,
        FooterComponent,
        MenuComponent,
        EcoStoreFormlyModule,
      ],
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
          provide: ecoStoreTenantStore,
          useValue: ecoStoreTenantStoreMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
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
  }, 10000);
});
