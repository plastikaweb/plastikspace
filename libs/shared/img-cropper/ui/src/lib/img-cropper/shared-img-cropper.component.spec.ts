import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SharedImgCropperComponent } from './shared-img-cropper.component';
import { axe } from 'vitest-axe';
import { MockComponent } from 'ng-mocks';
import { ImageCropperComponent } from 'ngx-image-cropper';

describe('SharedImgCropperComponent', () => {
  let component: SharedImgCropperComponent;
  let fixture: ComponentFixture<SharedImgCropperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedImgCropperComponent],
      providers: [provideTranslateService()],
    })
      .overrideComponent(SharedImgCropperComponent, {
        remove: { imports: [ImageCropperComponent] },
        add: { imports: [MockComponent(ImageCropperComponent)] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SharedImgCropperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset state on cancel', () => {
    const cancelSpy = vi.spyOn(component.cropCancelled, 'emit');

    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
    expect(component['imageBase64']()).toBeUndefined();
  });

  it('should handle file selection', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } } as unknown as Event;

    const mockReader = {
      readAsDataURL: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      result: 'data:image/png;base64,123',
    };

    // @ts-ignore
    vi.stubGlobal(
      'FileReader',
      class {
        readAsDataURL = mockReader.readAsDataURL;
        addEventListener = mockReader.addEventListener;
        removeEventListener = mockReader.removeEventListener;
        onload: (() => void) | null = null;
      }
    );

    component.onFileSelected(event);
    expect(mockReader.readAsDataURL).toHaveBeenCalledWith(file);
  });

  it('should handle drag events', () => {
    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as DragEvent;

    component.onDragOver(event);
    expect(component['isDragging']()).toBe(true);

    component.onDragLeave(event);
    expect(component['isDragging']()).toBe(false);
  });

  it('should render correct aria-label attribute bindings on icon-only buttons', () => {
    // 1. Error clear button
    component['errorMessage'].set({ key: 'common.image.error.loaded' });
    fixture.detectChanges();

    const clearBtn: HTMLButtonElement | null =
      fixture.nativeElement.querySelector('button[maticonbutton]');

    expect(clearBtn?.getAttribute('aria-label')).toBe('common.close');

    // 2. Crop mode zoom buttons
    component['imageBase64'].set('data:image/png;base64,123');
    fixture.detectChanges();

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button[maticonbutton]')
    ) as HTMLButtonElement[];
    const ariaLabels = buttons.map(btn => btn.getAttribute('aria-label'));

    expect(ariaLabels).toContain('common.image.crop.zoomOut');
    expect(ariaLabels).toContain('common.image.crop.zoomIn');
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });
});
