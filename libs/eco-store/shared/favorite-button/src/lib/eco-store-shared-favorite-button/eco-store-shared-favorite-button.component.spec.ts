import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoStoreSharedFavoriteButtonComponent } from './eco-store-shared-favorite-button.component';

describe('EcoStoreSharedFavoriteButton', () => {
  let component: EcoStoreSharedFavoriteButtonComponent;
  let fixture: ComponentFixture<EcoStoreSharedFavoriteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreSharedFavoriteButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreSharedFavoriteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set aria-hidden="true" on mat-icon element', () => {
    const iconElement: HTMLElement = fixture.nativeElement.querySelector('mat-icon');

    expect(iconElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should reflect isFavorite state in aria-pressed attribute and icon text', () => {
    const buttonElement: HTMLElement = fixture.nativeElement.querySelector('button');
    const iconElement: HTMLElement = fixture.nativeElement.querySelector('mat-icon');

    expect(buttonElement.getAttribute('aria-pressed')).toBe('false');
    expect(iconElement.textContent?.trim()).toBe('favorite_border');

    fixture.componentRef.setInput('isFavorite', true);
    fixture.detectChanges();

    expect(buttonElement.getAttribute('aria-pressed')).toBe('true');
    expect(iconElement.textContent?.trim()).toBe('favorite');
  });

  it('should trigger heart-beat animation and emit toggleFavorite on click', () => {
    const emitSpy = vi.spyOn(component.toggleFavorite, 'emit');
    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    const clickEvent = new MouseEvent('click', { cancelable: true, bubbles: true });

    buttonElement.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(buttonElement.classList.contains('heart-beat')).toBe(true);
    expect(emitSpy).toHaveBeenCalled();
  });
});
