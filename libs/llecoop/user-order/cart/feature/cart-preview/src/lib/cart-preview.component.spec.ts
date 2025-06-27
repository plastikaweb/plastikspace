import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { provideMockStore } from '@ngrx/store/testing';
import { CartPreviewComponent } from './cart-preview.component';

describe('CartPreviewComponent', () => {
  let component: CartPreviewComponent;
  let fixture: ComponentFixture<CartPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPreviewComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({}),
        {
          provide: Auth,
          useValue: {
            onAuthStateChanged: jest.fn(),
            currentUser: null,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
