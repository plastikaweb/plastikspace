import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { FormConfig } from '@plastik/core/entities';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { CountdownService } from '@plastik/shared/countdown/util';
import { axe } from 'jest-axe';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

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
      imports: [HeaderComponent, EcoStoreFormlyModule],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        {
          provide: ecoStoreTenantStore,
          useValue: mockEcoStoreTenantStore,
        },
        {
          provide: CountdownService,
          useValue: {
            createCountdown: jest.fn().mockReturnValue({
              data: jest.fn(),
              text: jest.fn().mockReturnValue(''),
              isExpired: jest.fn(),
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
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
