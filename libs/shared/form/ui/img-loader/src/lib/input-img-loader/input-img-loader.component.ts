import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const LOADER_IMG_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputImgLoaderComponent),
  multi: true,
};

@Component({
  selector: 'plastik-input-img-loader',
  imports: [MatIconModule, MatButtonModule, MatProgressBarModule, NgOptimizedImage],
  providers: [LOADER_IMG_ACCESSOR],
  templateUrl: './input-img-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputImgLoaderComponent implements ControlValueAccessor {
  protected readonly inputFile = viewChild<ElementRef>('inputFile');
  protected readonly cdr = inject(ChangeDetectorRef);

  value = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  disabled = signal<boolean>(false);

  folder = input<string>('');
  title = input<string>();
  progress = input<number>(0);
  upload = input<(file: File | null, folder?: string) => Promise<string | null>>();
  maxSize = input<number>(1000000);

  writeValue(value: string | null): void {
    if (!value) {
      this.value.set(null);
      return;
    }
    if (value !== this.value()) {
      this.value.set(value);
    }
    this.cdr.detectChanges();
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

  openAddFilesDialog() {
    if (this.inputFile()) {
      const e: HTMLElement = this.inputFile()?.nativeElement;
      e.click();
    }
  }

  onDeleteFile(): void {
    this.value.set(null);
    this.onChange(this.value());
    this.onTouch();
    this.cdr.markForCheck();
  }

  async onSelectFile(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files;

    if (file && file[0] && file[0].size > this.maxSize()) {
      throw new Error('File size exceeds maximum allowed size');
    }

    if (file && file[0]) {
      this.isLoading.set(true);
      const value = (await this.upload()?.(file[0], this.folder())) || null;
      this.value.set(value);
      this.onChange(this.value());
      this.isLoading.set(false);
      this.cdr.markForCheck();
    }
    this.onTouch();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  private onChange(_: string | null) {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouch() {}
}
