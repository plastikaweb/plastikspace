import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';

import { SharedFormFeatureComponent } from './shared-form-feature.component';

describe('SharedFormFeatureComponent', () => {
  let component: SharedFormFeatureComponent<unknown>;
  let fixture: ComponentFixture<SharedFormFeatureComponent<unknown>>;
  let componentRef: ComponentRef<SharedFormFeatureComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFormFeatureComponent, ReactiveFormsModule, FormlyModule.forRoot()],
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

    it('should update model but not emit changeEvent', () => {
      let submitEvent = false;
      const model = null;
      componentRef.setInput('model', model);
      componentRef.setInput('submitConfig', { submitAvailable: true });
      component.changeEvent.subscribe(() => (submitEvent = true));
      component.onModelChange(model as any);

      expect(submitEvent).toBeFalsy();
    });
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results.violations).toEqual([]);
  });
});
