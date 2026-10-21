import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
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

  it('should fallback to default aria-label "Add to favorites" when isFavorite is false and no custom ariaLabel is provided', () => {
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;

    expect(buttonElement.getAttribute('aria-label')).toBe('Add to favorites');
  });

  it('should fallback to default aria-label "Remove from favorites" when isFavorite is true and no custom ariaLabel is provided', () => {
    fixture.componentRef.setInput('isFavorite', true);
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;

    expect(buttonElement.getAttribute('aria-label')).toBe('Remove from favorites');
  });

  it('should use custom ariaLabel when provided', () => {
    fixture.componentRef.setInput('ariaLabel', 'Toggle favorite product');
    fixture.detectChanges();

    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;

    expect(buttonElement.getAttribute('aria-label')).toBe('Toggle favorite product');
  });

  it('should reflect aria-pressed attribute correctly', () => {
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;

    expect(buttonElement.getAttribute('aria-pressed')).toBe('false');

    fixture.componentRef.setInput('isFavorite', true);
    fixture.detectChanges();

    expect(buttonElement.getAttribute('aria-pressed')).toBe('true');
  });

  it('should have aria-hidden="true" on mat-icon to hide icon text glyph from screen readers', () => {
    const iconElement = fixture.debugElement.query(By.css('mat-icon')).nativeElement as HTMLElement;

    expect(iconElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should emit toggleFavorite on click', () => {
    const spy = vi.fn();

    component.toggleFavorite.subscribe(spy);

    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;

    buttonElement.click();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
