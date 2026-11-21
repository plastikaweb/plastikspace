import { ChangeDetectionStrategy, Component, ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FieldType, FieldTypeConfig, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { provideTranslateService } from '@ngx-translate/core';
import { axe } from 'vitest-axe';

import { SharedFormFeatureComponent } from './shared-form-feature.component';

@Component({
  selector: 'plastik-test-input-type',
  imports: [ReactiveFormsModule, FormlyModule],
  template: `<input aria-label="name" [formControl]="formControl" [formlyAttributes]="field" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestInputTypeComponent extends FieldType<FieldTypeConfig> {}

const REQUIRED_FIELD: FormlyFieldConfig[] = [
  { key: 'name', type: 'test-input', props: { required: true } },
];

describe('SharedFormFeatureComponent', () => {
  let component: SharedFormFeatureComponent<unknown>;
  let fixture: ComponentFixture<SharedFormFeatureComponent<unknown>>;
  let componentRef: ComponentRef<SharedFormFeatureComponent<unknown>>;

  const submitButton = (): HTMLButtonElement =>
    fixture.nativeElement.querySelector('button[type="submit"]');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedFormFeatureComponent,
        ReactiveFormsModule,
        FormlyModule.forRoot({
          types: [{ name: 'test-input', component: TestInputTypeComponent }],
        }),
      ],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFormFeatureComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('fields', []);
    componentRef.setInput('model', {});
    componentRef.setInput('submitConfig', { submitAvailable: true });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should emit changeEvent', () => {
      let submit;

      component.changeEvent.subscribe(() => (submit = true));
      component.onSubmit(new Event('submit'));

      expect(submit).toBeDefined();
    });

    it('should not emit changeEvent', () => {
      let submitEvent = false;

      componentRef.setInput('model', null);
      component.changeEvent.subscribe(() => (submitEvent = true));
      // Make form invalid by manually setting errors
      (component as any).form.setErrors({ invalid: true });
      fixture.detectChanges();

      component.onSubmit(new Event('submit'));

      expect(submitEvent).toBeFalsy();
    });
  });

  describe('alwaysEnabled', () => {
    it('keeps the submit disabled while the form is invalid when not set', () => {
      componentRef.setInput('fields', REQUIRED_FIELD);
      fixture.detectChanges();

      expect(submitButton().disabled).toBe(true);
    });

    it('keeps the submit enabled while the form is invalid when set', () => {
      componentRef.setInput('submitConfig', { alwaysEnabled: true });
      componentRef.setInput('fields', REQUIRED_FIELD);
      fixture.detectChanges();

      expect(submitButton().disabled).toBe(false);
    });

    it('emits nothing on an invalid submit, shows the messages and focuses the first invalid field', () => {
      const emitted = vi.fn();

      componentRef.setInput('submitConfig', { alwaysEnabled: true });
      componentRef.setInput('fields', REQUIRED_FIELD);
      fixture.detectChanges();
      component.changeEvent.subscribe(emitted);

      fixture.debugElement
        .query(By.directive(FormGroupDirective))
        .triggerEventHandler('submit', new Event('submit'));

      expect(emitted).not.toHaveBeenCalled();
      expect((component as any).form.get('name').touched).toBe(true);
      expect(document.activeElement).toBe(fixture.nativeElement.querySelector('input'));
    });

    it('emits once the form is valid', () => {
      const emitted = vi.fn();

      componentRef.setInput('submitConfig', { alwaysEnabled: true });
      componentRef.setInput('fields', REQUIRED_FIELD);
      fixture.detectChanges();
      component.changeEvent.subscribe(emitted);
      (component as any).form.get('name').setValue('Núria');

      fixture.debugElement
        .query(By.directive(FormGroupDirective))
        .triggerEventHandler('submit', new Event('submit'));

      expect(emitted).toHaveBeenCalledWith({ name: 'Núria' });
    });
  });

  describe('onModelChange', () => {
    it('should update model and emit changeEvent', () => {
      let submitEvent = false;
      const model = { q: 'pluto' };

      componentRef.setInput('model', null);
      componentRef.setInput('submitConfig', { submitAvailable: false });
      component.changeEvent.subscribe(() => (submitEvent = true));
      component.onModelChange(model as any);

      expect(submitEvent).toBeTruthy();
    });

    it('should emit temporaryChangeEvent when emitOnChange is true and form is valid', () => {
      let emittedModel = null;
      const model = { name: 'test' };

      componentRef.setInput('submitConfig', { emitOnChange: true });
      component.temporaryChangeEvent.subscribe(m => (emittedModel = m));

      // Form is valid by default in this test setup
      component.onModelChange(model as any);
      expect(emittedModel).toEqual(model);
    });

    it('should NOT emit temporaryChangeEvent when form is invalid', () => {
      let emitted = false;
      const model = { name: 't' };

      componentRef.setInput('submitConfig', { emitOnChange: true });
      component.temporaryChangeEvent.subscribe(() => (emitted = true));

      // Make form invalid
      (component as any).form.setErrors({ invalid: true });
      fixture.detectChanges();

      component.onModelChange(model as any);
      expect(emitted).toBeFalsy();
    });
  });

  describe('resetForm', () => {
    it('forces a full form reset when resetForm changes to a truthy value', () => {
      const resetSpy = vi.spyOn((component as any).form, 'reset');

      componentRef.setInput('resetForm', 1);
      fixture.detectChanges();

      expect(resetSpy).toHaveBeenCalledWith({}, expect.anything());
    });

    it('resets again on each counter increment', () => {
      const resetSpy = vi.spyOn((component as any).form, 'reset');

      componentRef.setInput('resetForm', 1);
      fixture.detectChanges();
      componentRef.setInput('resetForm', 2);
      fixture.detectChanges();

      expect(resetSpy).toHaveBeenCalledTimes(2);
    });

    it('clears the NgForm submitted state so untouched errors stay hidden after reset', () => {
      const formDebugEl = fixture.debugElement.query(By.directive(FormGroupDirective));
      const directive = formDebugEl.injector.get(FormGroupDirective);

      formDebugEl.triggerEventHandler('submit', new Event('submit'));
      expect(directive.submitted).toBe(true);

      componentRef.setInput('resetForm', 1);
      fixture.detectChanges();

      expect(directive.submitted).toBe(false);
    });

    it('does not reset form values while resetForm stays falsy', () => {
      const resetSpy = vi.spyOn((component as any).form, 'reset');

      fixture.detectChanges();

      expect(resetSpy).not.toHaveBeenCalled();
    });
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });
});
