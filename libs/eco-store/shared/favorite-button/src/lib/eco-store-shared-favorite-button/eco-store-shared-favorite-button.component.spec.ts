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

  it('should reflect isFavorite signal in aria-pressed attribute', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-pressed')).toBe('false');

    fixture.componentRef.setInput('isFavorite', true);
    fixture.detectChanges();

    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('should set aria-hidden on decorative icon', () => {
    const icon = fixture.nativeElement.querySelector('mat-icon');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
  });

  it('should bind ariaLabel input to button aria-label attribute', () => {
    fixture.componentRef.setInput('ariaLabel', 'Add to favorites');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Add to favorites');
  });
});
