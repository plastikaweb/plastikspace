import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { provideTranslateService } from '@ngx-translate/core';
import { InputSearchTypeComponent } from './input-search-type.component';
describe('InputSearchTypeComponent', () => {
  let component: InputSearchTypeComponent;
  let fixture: ComponentFixture<InputSearchTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'input-search',
              component: InputSearchTypeComponent,
            },
          ],
        }),
      ],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(InputSearchTypeComponent);
    component = fixture.componentInstance;
    const fieldConfig = {
      key: 'query',
      type: 'input-search',
      formControl: new FormControl(),
      props: {
        type: 'search',
        label: 'Search',
        placeholder: 'Search',
        required: true,
        minLength: 8,
        maxLength: 25,
      },
    };
    component.field = fieldConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
