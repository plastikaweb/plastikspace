import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipeToCloseDirective } from './swipe-to-close.directive';

@Component({
  imports: [SwipeToCloseDirective],
  template: `<div
    plastikSwipeToClose
    [swipeCloseThreshold]="threshold()"
    (swipeClose)="closes = closes + 1"></div>`,
})
class HostComponent {
  closes = 0;
  readonly threshold = signal(80);
}

/**
 * Builds a touch event: jsdom has no `Touch` constructor, so the touches are plain points.
 * @param {string} type The event type.
 * @param {number} clientX Where the finger is, horizontally.
 * @param {number} clientY Where the finger is, vertically.
 * @returns {Event} The event, with one touch at that point.
 */
function touch(type: string, clientX = 0, clientY = 0): Event {
  const event = new Event(type, { bubbles: true });
  const touches = type === 'touchend' ? [] : [{ clientX, clientY }];

  Object.defineProperty(event, 'touches', { value: touches });

  return event;
}

describe('SwipeToCloseDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;

  const swipe = (points: [number, number][]): void => {
    const [start, ...moves] = points;

    element.dispatchEvent(touch('touchstart', ...start));
    for (const point of moves) {
      element.dispatchEvent(touch('touchmove', ...point));
      fixture.detectChanges();
    }
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    element = fixture.nativeElement.querySelector('div');
  });

  it('follows the finger to the left without a transition, and never to the right', () => {
    swipe([
      [200, 100],
      [150, 102],
    ]);

    expect(element.style.transform).toBe('translateX(-50px)');
    expect(element.style.transition).toBe('none');

    swipe([
      [200, 100],
      [240, 100],
    ]);

    expect(element.style.transform).toBe('translateX(0px)');
  });

  it('asks to close after a swipe of 80px and gives the drawer back to Material', () => {
    swipe([
      [200, 100],
      [150, 100],
      [110, 104],
    ]);
    element.dispatchEvent(touch('touchend'));
    fixture.detectChanges();

    expect(fixture.componentInstance.closes).toBe(1);
    expect(element.style.transform).toBe('');
    expect(element.style.transition).toBe('');
  });

  it('takes the threshold from its input', () => {
    fixture.componentInstance.threshold.set(40);
    fixture.detectChanges();
    swipe([
      [200, 100],
      [150, 100],
    ]);
    element.dispatchEvent(touch('touchend'));

    expect(fixture.componentInstance.closes).toBe(1);
  });

  it('slides back after a shorter swipe, without asking to close', () => {
    swipe([
      [200, 100],
      [130, 100],
    ]);
    element.dispatchEvent(touch('touchend'));
    fixture.detectChanges();

    expect(fixture.componentInstance.closes).toBe(0);
    expect(element.style.transform).toBe('');
  });

  it('slides back with a Web Animation, keeping CSS transitions off until it ends', async () => {
    let finish: () => void = () => undefined;
    const animate = vi.fn(() => ({
      finished: new Promise<void>(resolve => (finish = resolve)),
    }));

    Object.defineProperty(element, 'animate', { value: animate, configurable: true });
    swipe([
      [200, 100],
      [140, 100],
    ]);
    element.dispatchEvent(touch('touchend'));
    fixture.detectChanges();

    expect(animate).toHaveBeenCalledWith(
      [{ transform: 'translateX(-60px)' }, { transform: 'translateX(0)' }],
      expect.objectContaining({ duration: 150 })
    );
    expect(element.style.transform).toBe('');
    expect(element.style.transition).toBe('none');

    finish();
    await new Promise(resolve => setTimeout(resolve));
    fixture.detectChanges();

    expect(element.style.transition).toBe('');
  });

  it('leaves a vertical drag to the scroll, even if it drifts to the left later', () => {
    swipe([
      [200, 100],
      [198, 140],
      [100, 150],
    ]);
    element.dispatchEvent(touch('touchend'));
    fixture.detectChanges();

    expect(element.style.transform).toBe('');
    expect(fixture.componentInstance.closes).toBe(0);
  });

  it('drops the gesture when the touch is cancelled', () => {
    swipe([
      [200, 100],
      [100, 100],
    ]);
    element.dispatchEvent(touch('touchcancel'));
    element.dispatchEvent(touch('touchend'));
    fixture.detectChanges();

    expect(fixture.componentInstance.closes).toBe(0);
    expect(element.style.transform).toBe('');
  });
});
