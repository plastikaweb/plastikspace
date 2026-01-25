import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { FormConfig } from '@plastik/core/entities';
import { EcoStoreFormlyModule } from '@plastik/eco-store/formly';
import { ecoStoreTenantStoreMock } from '@plastik/eco-store/tenant/testing';
import { axe, toHaveNoViolations } from 'jest-axe';
import { HeaderComponent } from './header.component';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';

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
          useValue: ecoStoreTenantStoreMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.componentRef.setInput('formConfig', mockFormConfig);
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
