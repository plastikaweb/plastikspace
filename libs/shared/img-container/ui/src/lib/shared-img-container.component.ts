import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export type ImageDimensions = { width: number; height: number } | undefined;

@Component({
  selector: 'plastik-shared-img-container',
  imports: [NgOptimizedImage, MatIcon, TranslateModule],
  templateUrl: './shared-img-container.component.html',
  styleUrl: './shared-img-container.component.scss',
  host: {
    class: 'relative block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedImgContainerComponent {
  src = input.required<string | null>();
  title = input.required<string>();
  dimensions = input<ImageDimensions>();
  quality = input<number>(80);
  lcpImage = input<boolean>(false);

  private readonly loaded = signal(false);
  private readonly error = signal(false);

  readonly isLoading = computed(() => !!this.src() && !this.loaded() && !this.error());
  readonly hasError = computed(() => this.error() || !this.src());

  onImageLoad(): void {
    this.loaded.set(true);
  }

  onImageError(): void {
    this.error.set(true);
    this.loaded.set(false);
  }
}
