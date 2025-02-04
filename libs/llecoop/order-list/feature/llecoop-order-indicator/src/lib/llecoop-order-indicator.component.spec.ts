import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  LLecoopOrderListStore,
  LlecoopUserOrderStore,
  MockedOrderListStore,
  MockedUserOrderStore,
} from '@plastik/llecoop/order-list/data-access';

import { LlecoopOrderIndicatorComponent } from './llecoop-order-indicator.component';

describe('LlecoopOrderIndicatorComponent', () => {
  let component: LlecoopOrderIndicatorComponent;
  let fixture: ComponentFixture<LlecoopOrderIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlecoopOrderIndicatorComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideRouter([]),
        { provide: LlecoopUserOrderStore, useValue: MockedUserOrderStore },
        { provide: LLecoopOrderListStore, useValue: MockedOrderListStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LlecoopOrderIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the correct value for openedUserOrderList()', () => {
    expect(component.openedUserOrderList()).toEqual({ id: '2', name: 'order B', orderListId: '1' });
  });
});
