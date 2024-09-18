import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

import { axe, toHaveNoViolations } from 'jest-axe';
import { SharedFormFeatureComponent } from './shared-form-feature.component';

describe('SharedFormFeatureComponent', () => {
  let component: SharedFormFeatureComponent<unknown>;
  let fixture: ComponentFixture<SharedFormFeatureComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedFormFeatureComponent, ReactiveFormsModule, FormlyModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFormFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should emit changeEvent', () => {
      let submit;
      component.model = {};
      component.changeEvent.subscribe(() => (submit = true));
      component.onSubmit(new Event('submit'));

      expect(submit).toBeDefined();
    });

    it('should not emit changeEvent', () => {
      let submit;
      component.model = null;
      component.changeEvent.subscribe(() => (submit = true));
      component.onSubmit(new Event('submit'));

      expect(submit).not.toBeDefined();
    });
  });

  describe('onModelChange', () => {
    let submit = false;
    it('should update model and emit changeEvent', () => {
      const model = { q: 'pluto' };
      component.model = {};
      component.submitAvailable = true;
      component.changeEvent.subscribe(() => (submit = true));
      component.onModelChange(model);

      expect(component.model).toEqual(model);
      expect(submit).toBeFalsy();
    });

    it('should update model but not emit changeEvent', () => {
      const model = null;
      component.model = model;
      component.submitAvailable = false;
      component.changeEvent.subscribe(() => (submit = true));
      component.onModelChange(model);

      expect(component.model).toBeNull();
      expect(submit).toBeFalsy();
    });
  });

  it('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
