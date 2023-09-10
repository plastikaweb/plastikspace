import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedUtilDynamicBgColorDirective } from './shared-util-dynamic-bg-color.directive';
// Create a simple test component to host the directive for testing
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: ` <div plastikDynamicBgColor [color]="color"></div> `,
})
class TestComponent {
  color = 'green';
}

describe('SharedUtilDynamicBgColorDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SharedUtilDynamicBgColorDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    element = fixture.debugElement.query(By.css('div'));
    fixture.detectChanges();
  });

  it('should not have a background color by default', () => {
    expect(element.nativeElement.style.backgroundColor).toEqual('');
  });

  it('should have a background color when color is set and we do hover', () => {
    element.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    expect(element.nativeElement.style.backgroundColor).toEqual('green');
  });

  it('should have a background color when color is set and we do hover', () => {
    element.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();
    expect(element.nativeElement.style.backgroundColor).toEqual('');
  });
});
