import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiUserOrderProductCardComponent } from './ui-user-order-product-card.component';

describe('UiUserOrderProductCardComponent', () => {
  let component: UiUserOrderProductCardComponent;
  let fixture: ComponentFixture<UiUserOrderProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
      imports: [UiUserOrderProductCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiUserOrderProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
