import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
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

  it('should have tooltips on buttons', () => {
    component.field.props!.resetSearch = true;
    component.formControl.setValue('abc');
    component['syncControl']();
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.directive(MatTooltip));
    expect(buttons.length).toBeGreaterThan(0);
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

  describe('resetSearch', () => {
    it('should enable clear button even if search term is invalid', () => {
      component.field.props!.resetSearch = true;
      component.formControl.setValue('a');
      component['syncControl']();
      fixture.detectChanges();

      const clearBtn = fixture.nativeElement.querySelector('.reset-search-button');
      expect(clearBtn).toBeTruthy();
      expect(clearBtn.disabled).toBeFalsy();
    });

    it('should disable clear button if form control is disabled', () => {
      component.field.props!.resetSearch = true;
      component.formControl.setValue('abc');
      component.formControl.disable();
      component['syncControl']();
      fixture.detectChanges();

      const clearBtn = fixture.nativeElement.querySelector('.reset-search-button');
      expect(clearBtn).toBeTruthy();
      expect(clearBtn.disabled).toBeTruthy();
    });
  });
});
