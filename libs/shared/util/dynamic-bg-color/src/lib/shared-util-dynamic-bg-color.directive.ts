import { Directive, ElementRef, inject, input } from '@angular/core';

/**
 * Directive to dynamically change the background color of an element on hover.
 */
@Directive({
  selector: '[plastikDynamicBgColor]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class SharedUtilDynamicBgColorDirective {
  readonly #el = inject(ElementRef);

  /**
   * The background color to apply on hover.
   */
  color = input('color');

  /**
   * Handles the mouseenter event to apply the background color.
   */
  protected onMouseEnter(): void {
    this.#setBackgroundColor(this.color());
  }

  /**
   * Handles the mouseleave event to remove the background color.
   */
  protected onMouseLeave(): void {
    this.#setBackgroundColor('');
  }

  /**
   * Sets the background color of the host element.
   * @param color - The color string to apply.
   */
  #setBackgroundColor(color: string): void {
    this.#el.nativeElement.style.backgroundColor = color;
  }
}
