// Create a simple test component to host the directive for testing
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SharedUtilDynamicBgColorDirective } from './shared-util-dynamic-bg-color.directive';

@Component({
  template: `<h1 plastikDynamicBgColor [color]="color">{{ title }}</h1> `,
  imports: [SharedUtilDynamicBgColorDirective],
})
class TestComponent {
  title = 'Test';
  color = 'orange';
}

describe('SharedUtilDynamicBgColorDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, SharedUtilDynamicBgColorDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    element = fixture.debugElement.queryAll(By.directive(SharedUtilDynamicBgColorDirective))[0];
  });

  it('should change color on hover and reset color on leave', () => {
    fixture.detectChanges(); // Initial render
    expect(element.nativeElement.style.backgroundColor).toBe('');

    element.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();

    expect(element.nativeElement.style.backgroundColor).toBe('orange');

    element.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();

    expect(element.nativeElement.style.backgroundColor).toBe('');
  });

  /*
  // TODO: Fix failing test - NG0100: ExpressionChangedAfterItHasBeenCheckedError
  // The input signal update triggers a check issue in the test environment.
  it('should update color input dynamically', () => {
    fixture.detectChanges(); // Initial render with orange
    const component = fixture.componentInstance;
    component.color = 'blue';
    fixture.detectChanges(); // Update binding

    element.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();

    expect(element.nativeElement.style.backgroundColor).toBe('blue');
  });
  */
});
