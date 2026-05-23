import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOrderCardDetailComponent } from './user-order-card-detail.component';

describe('UserOrderCardDetailComponent', () => {
  let component: UserOrderCardDetailComponent;
  let fixture: ComponentFixture<UserOrderCardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOrderCardDetailComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserOrderCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
