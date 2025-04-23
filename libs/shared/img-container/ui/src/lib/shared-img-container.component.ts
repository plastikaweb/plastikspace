import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'plastik-shared-img-container',
  imports: [NgOptimizedImage],
  templateUrl: './shared-img-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedImgContainerComponent {
  src = input<string>();
  width = input<number>();
  height = input<number>();
  title = input<string>();
  lcpImage = input<boolean>();
}
