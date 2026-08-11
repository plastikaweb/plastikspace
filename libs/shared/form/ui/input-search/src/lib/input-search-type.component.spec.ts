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

  describe('isDisabled', () => {
    it('should return true if term length is 1 and minLength is 2', () => {
      component.formControl.setValue('a');
      component['syncControl']();
      expect(component['isDisabled']()).toBe(true);
    });

    it('should return false if term length is 0', () => {
      component.formControl.setValue('');
      component['syncControl']();
      expect(component['isDisabled']()).toBe(false);
    });

    it('should return false if term length is >= minLength', () => {
      component.formControl.setValue('ab');
      component['syncControl']();
      expect(component['isDisabled']()).toBe(false);
    });
  });

  describe('A11Y-007: tooltips and clear-button decouple', () => {
    it('should mirror each icon button aria-label with a matching matTooltip', () => {
      // No translations loaded → `| translate` returns the key, so both bindings
      // resolve to the same string; this asserts the tooltip↔aria-label sync.
      const tooltipHosts = fixture.debugElement.queryAll(By.directive(MatTooltip));
      expect(tooltipHosts.length).toBeGreaterThan(0);

      for (const host of tooltipHosts) {
        const ariaLabel = host.nativeElement.getAttribute('aria-label');
        const tooltipMessage = host.injector.get(MatTooltip).message;
        expect(tooltipMessage).toBe(ariaLabel);
      }
    });

    it('should keep the clear button enabled for a below-minLength term so it can be cleared', () => {
      component.field.props!.resetSearch = true;
      component.formControl.setValue('a');
      component['syncControl']();
      fixture.detectChanges();

      const clearButton = fixture.nativeElement.querySelector('.reset-search-button');
      expect(clearButton).toBeTruthy();
      expect(clearButton.disabled).toBe(false);
      // The search button, by contrast, stays disabled for the same 1-char term.
      expect(component['isDisabled']()).toBe(true);
    });

    it('should keep the clear button enabled when the form status is INVALID', () => {
      component.field.props!.resetSearch = true;
      component.formControl.setValue('invalid-val');
      component['formStatus'].set('INVALID');
      component['syncControl']();
      fixture.detectChanges();

      const clearButton = fixture.nativeElement.querySelector('.reset-search-button');
      expect(clearButton).toBeTruthy();
      expect(clearButton.disabled).toBe(false);
    });
  });

  describe('A11Y-010: keyboard support and focus management', () => {
    it('should trigger a full search on Enter', () => {
      const onSearchSpy = vi.fn();
      component.field.props!.onSearch = onSearchSpy;
      component.formControl.setValue('abc');
      component['syncControl']();

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(onSearchSpy).toHaveBeenCalledWith('abc', component.field);
    });

    it('should fire the search only once for a single Enter in noButton mode', () => {
      // keyup also reacts to typing, so Enter must be owned by keydown alone —
      // otherwise a noButton consumer fires two searches (and two fetches) per Enter.
      const onSearchSpy = vi.fn();
      component.field.props!.noButton = true;
      component.field.props!.onSearch = onSearchSpy;
      component.formControl.setValue('abc');
      component['syncControl']();

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

      expect(onSearchSpy).toHaveBeenCalledTimes(1);
    });

    it('should reset the search and restore focus to the input on Escape', () => {
      component.field.props!.resetSearch = true;
      const onPartialSearchSpy = vi.fn();
      component.field.props!.onPartialSearch = onPartialSearchSpy;
      component.formControl.setValue('abc');
      component['syncControl']();
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input')).nativeElement;
      const focusSpy = vi.spyOn(input, 'focus');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(component.formControl.value).toBe('');
      expect(onPartialSearchSpy).toHaveBeenCalledWith('', component.field);
      expect(focusSpy).toHaveBeenCalled();
    });
  });
});
