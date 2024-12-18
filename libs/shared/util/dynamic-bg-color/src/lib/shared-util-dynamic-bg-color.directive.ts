import { Directive, ElementRef, HostListener, inject, input } from '@angular/core';

@Directive({
  selector: '[plastikDynamicBgColor]',
})
export class SharedUtilDynamicBgColorDirective {
  readonly #el = inject(ElementRef);

  color = input('color');

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.setBackgroundColor(this.color());
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.setBackgroundColor('');
  }

  private setBackgroundColor(color: string): void {
    this.#el.nativeElement.style.backgroundColor = color;
  }
}
