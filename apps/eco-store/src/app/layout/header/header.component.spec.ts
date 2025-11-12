import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormConfig } from '@plastik/core/entities';
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
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.componentRef.setInput('formConfig', mockFormConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
