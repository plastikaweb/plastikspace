import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormlyAddonsWrapperComponent } from './formly-addons-wrapper.component';

describe('FormlyAddonsWrapperComponent', () => {
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
