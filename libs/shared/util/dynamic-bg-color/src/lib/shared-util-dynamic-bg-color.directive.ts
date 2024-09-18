import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[plastikDynamicBgColor]',
  standalone: true,
})
export class SharedUtilDynamicBgColorDirective {
  @Input() color!: string;
  @HostListener('mouseenter') onMouseEnter(): void {
    this.changeColor(this.color);
  }
  @HostListener('mouseleave') onMouseLeave(): void {
    this.changeColor(null);
  }

  constructor(private readonly el: ElementRef) {}

  changeColor(color: string | null): void {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
