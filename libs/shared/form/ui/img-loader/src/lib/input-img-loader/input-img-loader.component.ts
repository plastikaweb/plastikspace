import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  forwardRef,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';

import { InputImgLoaderProps } from './input-img-loader-props';

const LOADER_IMG_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputImgLoaderComponent),
  multi: true,
};

@Component({
  selector: 'plastik-input-img-loader',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SharedImgContainerComponent,
    NgClass,
  ],
  providers: [LOADER_IMG_ACCESSOR],
  templateUrl: './input-img-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputImgLoaderComponent implements ControlValueAccessor {
  protected readonly cdr = inject(ChangeDetectorRef);
  protected isDragOver = signal<boolean>(false);

  value = signal<string | null>(null);
  disabled = signal<boolean>(false);

  folder = input<string>('');
  title = input<string>();
  progress = input<number>(0);
  upload = input<InputImgLoaderProps['upload']>();
  maxSize = input<number>(1 * 1024 * 1024);
  minHeight = input<number>(1024);
  minWidth = input<number>(1024);
  fileUrl = input<string | null>(null);
  cdnUrl = input<string>();
  imgHeight = input<number>(200);
  imgWidth = input<number>(200);
  lcpImage = input<boolean>(false);
  isLoading = linkedSignal({
    source: this.progress,
    computation: (progress: number) => progress > 0,
  });

  constructor() {
    effect(() => {
      if (this.fileUrl()) {
        this.value.set(this.fileUrl());
        this.onChange(this.fileUrl());
        this.cdr.detectChanges();
      }
    });
  }

  writeValue(value: string | null): void {
    if (!value) {
      this.value.set(null);
      return;
    }

    if (value !== this.value()) {
      this.value.set(value);
    }
  }
  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onDeleteFile(event: Event): void {
    event.stopPropagation();
    this.value.set(null);
    this.onChange(this.value());
    this.onTouch();
    this.cdr.detectChanges();
  }

  async onSelectFile(event: Event): Promise<void> {
    const files = (event.target as HTMLInputElement).files;
    const file = files?.[0];
    if (!file) return;

    try {
      if (file.size > this.maxSize()) {
        // TODO: show toast con error
        throw new Error('El archivo supera el tamaño máximo permitido');
      }

      await this.validateImageDimensions(file);

      this.isLoading.set(true);

      await (this.upload()?.(file, this.folder()) ?? Promise.resolve());
      this.onTouch();
    } catch (error) {
      // TODO: mostrar toast con erro
      this.onTouch();
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      this.isLoading.set(false);
      this.isDragOver.set(false);
    }
  }

  private validateImageDimensions(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          if (image.height < this.minHeight() || image.width < this.minWidth()) {
            reject(
              new Error(
                `Las dimensiones de la imagen no cumplen los mínimos: ${this.minHeight()}x${this.minWidth()}`
              )
            );
          } else {
            resolve();
          }
        };
        image.onerror = () => {
          reject(new Error('No se ha podido cargar la imagen para validar dimensiones.'));
        };
        image.src = reader.result as string;
      };
      reader.onerror = () => {
        reject(new Error('No se ha podido leer el archivo de imagen.'));
      };
      reader.readAsDataURL(file);
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.onSelectFile({ target: { files } } as unknown as Event);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  private onChange(_: string | null) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouch() {}
}
