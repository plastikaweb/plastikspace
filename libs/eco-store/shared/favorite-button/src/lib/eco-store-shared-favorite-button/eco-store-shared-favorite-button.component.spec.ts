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
});
