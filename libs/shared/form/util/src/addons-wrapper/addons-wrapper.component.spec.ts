import { ChangeDetectionStrategy, Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyFormField } from '@ngx-formly/material/form-field';
import { withFormlyFieldInput } from '@ngx-formly/material/input';

import { provideFormlyAddons } from '../providers';
import { FormlyAddonsWrapperComponent } from './formly-addons-wrapper.component';

@Component({
  imports: [ReactiveFormsModule, FormlyForm],
  template: `
    <form [formGroup]="form">
      <formly-form [form]="form" [fields]="fields" [model]="model" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class HostComponent {
  form = new FormGroup({});
  model = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'email',
      type: 'input',
      props: {
        label: 'Email',
        addonLeft: { type: 'icon', icon: 'mail', classes: 'first-class second-class!' },
      },
    },
    {
      key: 'name',
      type: 'input',
      props: { label: 'Name', addonRight: { type: 'icon', icon: 'person' } },
    },
  ];
}

describe('FormlyAddonsWrapperComponent', () => {
  describe('on its own', () => {
    let component: FormlyAddonsWrapperComponent;
    let fixture: ComponentFixture<FormlyAddonsWrapperComponent>;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [FormlyAddonsWrapperComponent],
        providers: [provideZonelessChangeDetection()],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(FormlyAddonsWrapperComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    test('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('around a field', () => {
    let fixture: ComponentFixture<HostComponent>;
    let host: HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [HostComponent],
        providers: [
          provideZonelessChangeDetection(),
          provideFormlyCore([withFormlyFormField(), withFormlyFieldInput()]),
          provideFormlyAddons(),
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(HostComponent);
      host = fixture.nativeElement;
      fixture.detectChanges();
      // The wrapper hands each icon to its form field one turn after the first paint.
      await new Promise(resolve => setTimeout(resolve));
      fixture.detectChanges();
      await fixture.whenStable();
    });

    test('should put every class of the addon on its icon', () => {
      const icon = host.querySelector('.mat-mdc-form-field-icon-prefix mat-icon');

      expect(icon?.classList.contains('first-class')).toBe(true);
      expect(icon?.classList.contains('second-class!')).toBe(true);
    });

    test('should draw an addon that names no class', () => {
      const icon = host.querySelector('.mat-mdc-form-field-icon-suffix mat-icon');

      expect(icon?.textContent?.trim()).toBe('person');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
