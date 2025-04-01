import { axe, toHaveNoViolations } from 'jest-axe';

import { KeyValue } from '@angular/common';
import { ComponentRef, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LlecoopOrder, llecoopUserOrderStatus } from '@plastik/llecoop/entities';

import { UiOrderListOrdersStatusResumeComponent } from './ui-order-list-orders-status-resume.component';

describe('UiOrderListOrdersStatusResumeComponent', () => {
  let component: UiOrderListOrdersStatusResumeComponent;
  let fixture: ComponentFixture<UiOrderListOrdersStatusResumeComponent>;
  let componentRef: ComponentRef<UiOrderListOrdersStatusResumeComponent>;

  const mockOrdersStatus: LlecoopOrder['userOrdersStatus'] = {
    waitingReview: 5,
    reviewed: 3,
    delivered: 2,
    notReviewed: 1,
    notDelivered: 0,
    cancelled: 4,
    blocked: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiOrderListOrdersStatusResumeComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(UiOrderListOrdersStatusResumeComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('orderName', 'Test Order');
    componentRef.setInput('ordersStatus', mockOrdersStatus);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should correctly set input properties', () => {
      expect(component.orderName()).toBe('Test Order');
      expect(component.ordersStatus()).toEqual(mockOrdersStatus);
    });
  });

  describe('Helper methods', () => {
    it('should return correct status label', () => {
      expect(component['getStatusLabel']('waitingReview')).toBe(
        llecoopUserOrderStatus.waitingReview.label
      );
      expect(component['getStatusLabel']('reviewed')).toBe(llecoopUserOrderStatus.reviewed.label);
      expect(component['getStatusLabel']('cancelled')).toBe(llecoopUserOrderStatus.cancelled.label);
    });

    it('should return correct status class', () => {
      expect(component['getStatusClass']('waitingReview')).toBe(
        llecoopUserOrderStatus.waitingReview.class
      );
      expect(component['getStatusClass']('delivered')).toBe(llecoopUserOrderStatus.delivered.class);
      expect(component['getStatusClass']('notDelivered')).toBe(
        llecoopUserOrderStatus.notDelivered.class
      );
    });

    it('should return correct status icon', () => {
      expect(component['getIcon']('waitingReview')).toBe(llecoopUserOrderStatus.waitingReview.icon);
      expect(component['getIcon']('reviewed')).toBe(llecoopUserOrderStatus.reviewed.icon);
      expect(component['getIcon']('cancelled')).toBe(llecoopUserOrderStatus.cancelled.icon);
    });

    it('should compare and sort statuses correctly', () => {
      const a: KeyValue<string, number> = { key: 'cancelled', value: 5 };
      const b: KeyValue<string, number> = { key: 'waitingReview', value: 3 };

      expect(component['compareOrderStatus'](a, b)).toBeGreaterThan(0);
      expect(component['compareOrderStatus'](b, a)).toBeLessThan(0);

      const c: KeyValue<string, number> = { key: 'delivered', value: 2 };
      const d: KeyValue<string, number> = { key: 'reviewed', value: 1 };

      expect(component['compareOrderStatus'](c, d)).toBeGreaterThan(0);
    });
  });

  describe('Component rendering', () => {
    it('should render correct number of list items', () => {
      const listItems = fixture.debugElement.queryAll(By.css('li'));
      const expectedCount = Object.values(mockOrdersStatus).length;
      expect(listItems.length).toBe(expectedCount);
    });

    it('should display status labels correctly', () => {
      const labels = fixture.debugElement.queryAll(By.css('li span:nth-child(2)'));

      expect(
        labels.some(label =>
          label.nativeElement.textContent.includes(llecoopUserOrderStatus.waitingReview.label)
        )
      ).toBe(true);

      expect(
        labels.some(label =>
          label.nativeElement.textContent.includes(llecoopUserOrderStatus.reviewed.label)
        )
      ).toBe(true);
    });

    it('should display status counts correctly', () => {
      const waitingItem = fixture.debugElement.query(
        By.css(`li.${llecoopUserOrderStatus.waitingReview.class} span:last-child`)
      );
      expect(waitingItem.nativeElement.textContent).toBe('5');

      const reviewedItem = fixture.debugElement.query(
        By.css(`li.${llecoopUserOrderStatus.reviewed.class} span:last-child`)
      );
      expect(reviewedItem.nativeElement.textContent).toBe('3');
    });

    it('should set correct aria-label for the list', () => {
      const list = fixture.debugElement.query(By.css('ul'));
      expect(list.attributes['aria-label']).toBe('Estat de les comandes de Test Order');
    });

    it('should display items in correct order based on priority', () => {
      const items = fixture.debugElement.queryAll(By.css('li'));

      const firstItemClass = items[0].classes[llecoopUserOrderStatus.waitingReview.class];
      expect(firstItemClass).toBe(true);
      const expectedOrder = [
        'waitingReview',
        'reviewed',
        'delivered',
        'notReviewed',
        'cancelled',
      ] as const;
      items.forEach((item, index) => {
        if (index < expectedOrder.length) {
          const statusKey = expectedOrder[index];
          const expectedClass = llecoopUserOrderStatus[statusKey].class;
          expect(item.classes[expectedClass]).toBe(true);
        }
      });
    });
  });

  it('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
