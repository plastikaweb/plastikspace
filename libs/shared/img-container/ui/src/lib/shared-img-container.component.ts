import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ImageDimensions = { width: number; height: number } | undefined;

@Component({
  selector: 'plastik-shared-img-container',
  imports: [NgOptimizedImage],
  templateUrl: './shared-img-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedImgContainerComponent {
  src = input.required<string>();
  title = input.required<string>();
  dimensions = input<ImageDimensions>();
  quality = input<number>(80);
  lcpImage = input<boolean>(false);
}
