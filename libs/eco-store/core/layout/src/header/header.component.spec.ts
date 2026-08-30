import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { FormConfig } from '@plastik/core/entities';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { providePlainInputFormly } from '@plastik/shared/form/util';
import { CountdownService } from '@plastik/shared/countdown/util';
import { LanguageSwitcherService } from '@plastik/shared/translation';
import { axe } from 'vitest-axe';
import { EcoHeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: EcoHeaderComponent;
  let fixture: ComponentFixture<EcoHeaderComponent>;

  const mockFormConfig: FormConfig<{ query: string }> = {
    getConfig: () => [
      {
        fieldGroup: [
          {
            key: 'query',
            type: 'input-search',
            props: {
              label: 'Search',
              placeholder: 'Search',
            },
          },
        ],
      },
    ],
    getSubmitFormConfig: () => ({
      submitAvailable: false,
      disableOnSubmit: false,
    }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoHeaderComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        providePlainInputFormly(),
        ...provideEnvironmentPocketBaseTranslationMock(),
        {
          provide: LanguageSwitcherService,
          useValue: {
            init: vi.fn().mockReturnValue('en'),
            save: vi.fn(),
          },
        },
        {
          provide: ecoStoreTenantStore,
          useValue: mockEcoStoreTenantStore,
        },
        {
          provide: CountdownService,
          useValue: {
            createCountdown: vi.fn().mockReturnValue({
              data: vi.fn(),
              text: vi.fn().mockReturnValue(''),
              isExpired: vi.fn(),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoHeaderComponent);
    fixture.componentRef.setInput('formConfig', mockFormConfig);
    fixture.componentRef.setInput('tenant', mockEcoStoreTenantStore.tenant());
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });
});
