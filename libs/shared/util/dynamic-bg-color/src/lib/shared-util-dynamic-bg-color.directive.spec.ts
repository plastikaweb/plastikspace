// Create a simple test component to host the directive for testing
import {
  ChangeDetectionStrategy,
  Component,
  DebugElement,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SharedUtilDynamicBgColorDirective } from './shared-util-dynamic-bg-color.directive';

@Component({
  template: `<h1 plastikDynamicBgColor color="orange">{{ title }}</h1> `,
  imports: [SharedUtilDynamicBgColorDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {}

describe('SharedUtilDynamicBgColorDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [TestComponent, SharedUtilDynamicBgColorDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    element = fixture.debugElement.queryAll(By.directive(SharedUtilDynamicBgColorDirective))[0];
    fixture.detectChanges();
  });

  it('should change color on hover and reset color on leave', () => {
    expect(element.nativeElement.style.backgroundColor).toBe('');

    element.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();

    expect(element.nativeElement.style.backgroundColor).toBe('orange');

    element.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();

    expect(element.nativeElement.style.backgroundColor).toBe('');
  });
});
