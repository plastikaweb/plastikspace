import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[plastikDynamicBgColor]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class SharedUtilDynamicBgColorDirective {
  readonly #el = inject(ElementRef);

  color = input('color');

  onMouseEnter(): void {
    this.#setBackgroundColor(this.color());
  }

  onMouseLeave(): void {
    this.#setBackgroundColor('');
  }

  #setBackgroundColor(color: string): void {
    this.#el.nativeElement.style.backgroundColor = color;
  }
}
