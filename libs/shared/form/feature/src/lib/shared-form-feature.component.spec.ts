import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { ComponentRef } from '@angular/core';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SharedFormFeatureComponent } from './shared-form-feature.component';

xdescribe('SharedFormFeatureComponent', () => {
  let component: SharedFormFeatureComponent<unknown>;
  let fixture: ComponentFixture<SharedFormFeatureComponent<unknown>>;
  let componentRef: ComponentRef<SharedFormFeatureComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFormFeatureComponent, ReactiveFormsModule, FormlyModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFormFeatureComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('fields', []);
    componentRef.setInput('model', {});
    componentRef.setInput('submitAvailable', true);

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
      let submit;
      componentRef.setInput('model', null);
      component.changeEvent.subscribe(() => (submit = true));
      component.onSubmit(new Event('submit'));

      expect(submit).not.toBeDefined();
    });
  });

  describe('onModelChange', () => {
    let submit = false;
    it('should update model and emit changeEvent', () => {
      const model = { q: 'pluto' };
      componentRef.setInput('model', null);
      componentRef.setInput('submitAvailable', true);
      component.changeEvent.subscribe(() => (submit = true));
      component.onModelChange(model);

      expect(component.model()).toEqual(model);
      expect(submit).toBeFalsy();
    });

    it('should update model but not emit changeEvent', () => {
      const model = null;
      componentRef.setInput('model', model);
      componentRef.setInput('submitAvailable', false);
      component.changeEvent.subscribe(() => (submit = true));
      component.onModelChange(model);

      expect(component.model()).toBeNull();
      expect(submit).toBeFalsy();
    });
  });

  it('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
