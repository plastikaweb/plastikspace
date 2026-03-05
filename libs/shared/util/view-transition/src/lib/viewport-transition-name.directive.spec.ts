import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewportTransitionNameDirective } from './viewport-transition-name.directive';

@Component({
  template: `<div plastikViewportTransitionName></div>`,
  standalone: true,
  imports: [ViewportTransitionNameDirective],
})
class TestComponent {}

describe('ViewportTransitionNameDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let intersectionObserverMock: jest.Mock;
  let observeMock: jest.Mock;
  let disconnectMock: jest.Mock;

  beforeEach(() => {
    observeMock = jest.fn();
    disconnectMock = jest.fn();

    intersectionObserverMock = jest.fn(callback => ({
      observe: observeMock,
      disconnect: disconnectMock,
      unobserve: jest.fn(),
    })) as unknown as jest.Mock;

    window.IntersectionObserver = intersectionObserverMock as any;

    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance and initialize IntersectionObserver', () => {
    expect(intersectionObserverMock).toHaveBeenCalled();
    expect(observeMock).toHaveBeenCalledWith(expect.any(Element));
  });

  it('should set view-transition-name to none when element is not intersecting', () => {
    const callback = intersectionObserverMock.mock.calls[0][0];
    const mockElement = fixture.debugElement.children[0].nativeElement;

    // Simulate intersection change
    callback([{ isIntersecting: false }]);

    expect(mockElement.style.viewTransitionName).toBe('none');
  });

  it('should remove view-transition-name style when element is intersecting', () => {
    const callback = intersectionObserverMock.mock.calls[0][0];
    const mockElement = fixture.debugElement.children[0].nativeElement;

    // Simulate it first being set to none
    mockElement.style.viewTransitionName = 'none';

    // Simulate intersection
    callback([{ isIntersecting: true }]);

    expect(mockElement.style.viewTransitionName).toBe('');
  });

  it('should clean up the observer on component destroy', () => {
    fixture.destroy();
    expect(disconnectMock).toHaveBeenCalled();
  });
});
