import { DOCUMENT } from '@angular/common';
import { computed, Directive, ElementRef, inject, input, output, signal } from '@angular/core';

/** The swipe that closes, by default: eco-admin's frozen drawer (`00 Components/Calaix mòbil`). */
export const SWIPE_TO_CLOSE_DEFAULT_PX = 80;

/** How far the finger travels before the gesture counts as a swipe or as a scroll. */
const AXIS_LOCK_PX = 8;

/** The slide back after a swipe too short to close. */
const SETTLE_MS = 150;

/**
 * Closes a panel that slides in from the left, such as a `mat-sidenav` in `over` mode, with a swipe
 * to the left: the panel follows the finger and, on release, asks to close when the swipe reached
 * the threshold, or slides back when it did not. A vertical drag stays a scroll of the panel.
 *
 * It only moves the element while the finger is down and emits `swipeClose`: opening, closing and
 * their animation belong to the host (Material's drawer, for one). Left to right only.
 *
 * The slide back is a Web Animation, not a CSS transition: `mat-drawer` reads any `transitionend` on
 * itself as the end of its own animation, emits `openedChange(true)` again and records the focused
 * element, inside the drawer, as the one to give the focus back to when it closes.
 */
@Directive({
  selector: '[plastikSwipeToClose]',
  host: {
    '(touchstart)': 'onTouchStart($event)',
    '(touchmove)': 'onTouchMove($event)',
    '(touchend)': 'onTouchEnd()',
    '(touchcancel)': 'reset()',
    '[style.transform]': 'transform()',
    '[style.transition]': "isDragging() ? 'none' : null",
  },
})
export class SwipeToCloseDirective {
  /** How many pixels to the left close the panel. */
  readonly swipeCloseThreshold = input(SWIPE_TO_CLOSE_DEFAULT_PX);

  /** The swipe reached the threshold: the host should close the panel. */
  readonly swipeClose = output<void>();

  readonly #element: HTMLElement = inject(ElementRef).nativeElement;
  readonly #window = inject(DOCUMENT).defaultView;
  readonly #offset = signal(0);
  readonly #isDragging = signal(false);
  readonly #isSettling = signal(false);

  #startX = 0;
  #startY = 0;
  #axis: 'x' | 'y' | null = null;

  /** The finger is moving the panel, or it slides back: the host's transition must stay out. */
  protected readonly isDragging = computed(() => this.#isDragging() || this.#isSettling());

  /** Where the panel stands under the finger, or the host's own position when nothing drags it. */
  protected readonly transform = computed(() =>
    this.#isDragging() ? `translateX(${-this.#offset()}px)` : null
  );

  /**
   * Remembers where the finger touched down.
   * @param {TouchEvent} event The touch that starts the gesture.
   */
  onTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];

    if (!touch || event.touches.length > 1) {
      return;
    }

    this.#startX = touch.clientX;
    this.#startY = touch.clientY;
    this.#axis = null;
  }

  /**
   * Decides the axis once the finger has moved a few pixels, then follows it to the left.
   * @param {TouchEvent} event The touch that moves.
   */
  onTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];

    if (!touch || this.#axis === 'y') {
      return;
    }

    const deltaX = this.#startX - touch.clientX;
    const deltaY = Math.abs(touch.clientY - this.#startY);

    if (this.#axis === null) {
      if (Math.max(Math.abs(deltaX), deltaY) < AXIS_LOCK_PX) {
        return;
      }

      this.#axis = Math.abs(deltaX) > deltaY ? 'x' : 'y';

      if (this.#axis === 'y') {
        return;
      }
    }

    this.#isDragging.set(true);
    this.#offset.set(Math.max(0, deltaX));
  }

  /** Asks to close when the swipe went far enough; the panel slides back otherwise. */
  onTouchEnd(): void {
    const offset = this.#offset();
    const hasDragged = this.#isDragging();

    this.reset();

    if (!hasDragged) {
      return;
    }

    if (offset >= this.swipeCloseThreshold()) {
      this.swipeClose.emit();

      return;
    }

    this.#settle(offset);
  }

  /** Gives the panel back to its host. */
  reset(): void {
    this.#isDragging.set(false);
    this.#offset.set(0);
    this.#axis = null;
  }

  /**
   * Slides the panel back from where the finger left it, unless the user asked for less motion.
   * @param {number} offset How far to the left the panel stands.
   */
  #settle(offset: number): void {
    const isReducedMotion = this.#window?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (!offset || isReducedMotion || typeof this.#element.animate !== 'function') {
      return;
    }

    this.#isSettling.set(true);
    this.#element
      .animate([{ transform: `translateX(${-offset}px)` }, { transform: 'translateX(0)' }], {
        duration: SETTLE_MS,
        easing: 'ease-out',
      })
      .finished.catch(() => undefined)
      .finally(() => this.#isSettling.set(false));
  }
}
