import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EcoStoreSharedFavoriteButtonComponent } from './eco-store-shared-favorite-button.component';

describe('EcoStoreSharedFavoriteButtonComponent', () => {
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

  it('should reflect aria-pressed attribute based on isFavorite input', () => {
    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(buttonElement.getAttribute('aria-pressed')).toBe('false');

    fixture.componentRef.setInput('isFavorite', true);
    fixture.detectChanges();

    expect(buttonElement.getAttribute('aria-pressed')).toBe('true');
  });

  it('should set aria-label attribute based on ariaLabel input', () => {
    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    fixture.componentRef.setInput('ariaLabel', 'Add Organic Apples to favorites');
    fixture.detectChanges();

    expect(buttonElement.getAttribute('aria-label')).toBe('Add Organic Apples to favorites');
  });

  it('should have aria-hidden="true" on mat-icon element', () => {
    const iconElement: HTMLElement = fixture.nativeElement.querySelector('mat-icon');

    expect(iconElement.getAttribute('aria-hidden')).toBe('true');
  });

  it('should emit toggleFavorite event and trigger animation on click', () => {
    const emitSpy = vi.spyOn(component.toggleFavorite, 'emit');
    const buttonElement: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    buttonElement.click();

    expect(emitSpy).toHaveBeenCalledTimes(1);
  });
});
