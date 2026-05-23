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
        required: false,
        minLength: 2,
        maxLength: 25,
      },
    };
    component.field = fieldConfig;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('triggerSearch', () => {
    it('should NOT call onSearch if term length is 1', () => {
      const onSearchSpy = vi.fn();
      component.field.props!.onSearch = onSearchSpy;
      component.formControl.setValue('a');
      component['syncControl']();

      component['triggerSearch']();
      expect(onSearchSpy).not.toHaveBeenCalled();
    });

    it('should call onSearch if term length is >= 2', () => {
      const onSearchSpy = vi.fn();
      component.field.props!.onSearch = onSearchSpy;
      component.formControl.setValue('abc');
      component['syncControl']();

      component['triggerSearch']();
      expect(onSearchSpy).toHaveBeenCalledWith('abc', component.field);
    });

    it('should call onSearch if term is empty (reset)', () => {
      const onSearchSpy = vi.fn();
      component.field.props!.onSearch = onSearchSpy;
      component.formControl.setValue('');
      component['syncControl']();

      component['triggerSearch']();
      expect(onSearchSpy).toHaveBeenCalledWith('', component.field);
    });
  });

  describe('triggerPartialSearch', () => {
    it('should NOT call onPartialSearch if term length is 1', () => {
      const onPartialSearchSpy = vi.fn();
      component.field.props!.onPartialSearch = onPartialSearchSpy;
      component.formControl.setValue('a');
      component['syncControl']();

      component['triggerPartialSearch']();
      expect(onPartialSearchSpy).not.toHaveBeenCalled();
    });

    it('should call onPartialSearch if term length is >= 2', () => {
      const onPartialSearchSpy = vi.fn();
      component.field.props!.onPartialSearch = onPartialSearchSpy;
      component.formControl.setValue('abc');
      component['syncControl']();

      component['triggerPartialSearch']();
      expect(onPartialSearchSpy).toHaveBeenCalledWith('abc', component.field);
    });
  });
});
