import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';

import { UserOrderUtilsService } from './order-list.util';

vi.mock('@plastik/llecoop/entities', async importOriginal => {
  const actual = await importOriginal<typeof import('@plastik/llecoop/entities')>();
  return {
    ...actual,
    // Inject a malicious delivery-date label to exercise the escapeHtml path (SEC-05).
    // The real `tuesday → dijous` entry is preserved so the formatting test below stays valid.
    llecoopUserOrderDateOptions: {
      ...actual.llecoopUserOrderDateOptions,
      delivery: [
        ...actual.llecoopUserOrderDateOptions.delivery,
        { value: 'xss', label: '<img src=x onerror="alert(1)">' },
      ],
    },
  };
});

describe('order-list-util', () => {
  let service: UserOrderUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), UserOrderUtilsService],
    });

    service = TestBed.inject(UserOrderUtilsService);
  });

  describe('formatUserOrderDeliveryDate', () => {
    it('should return formatted delivery date for a valid order', () => {
      const order = {
        deliveryType: 'delivery' as LlecoopUserOrder['deliveryType'],
        deliveryTime: '16/17' as LlecoopUserOrder['deliveryTime'],
        deliveryDate: 'tuesday' as LlecoopUserOrder['deliveryDate'],
      };
      const result = service.formatDeliveryDateAndTime(order);
      expect(result).toEqual({
        changingThisBreaksApplicationSecurity: '<p>dijous entre les 16h i les 17h</p>',
      });
    });

    it('should escape an injected XSS payload in the delivery label (SEC-05)', () => {
      const order = {
        deliveryType: 'delivery' as LlecoopUserOrder['deliveryType'],
        deliveryTime: '16/17' as LlecoopUserOrder['deliveryTime'],
        deliveryDate: 'xss' as LlecoopUserOrder['deliveryDate'],
      };
      const result = service.formatDeliveryDateAndTime(order) as {
        changingThisBreaksApplicationSecurity: string;
      };
      const html = result.changingThisBreaksApplicationSecurity;

      // The raw tag must not survive; the leading `<` is encoded, so it cannot execute.
      expect(html).not.toContain('<img');
      expect(html).not.toContain('onerror="');
      expect(html).toContain('&lt;img');
    });
  });

  describe('formatOrderStatus', () => {
    it('should return formatted order status with default values', () => {
      const format = service.formatOrderStatus(
        'status',
        'Estat',
        'status',
        ['min-w-[145px]'],
        'status'
      );
      expect(format).toEqual({
        key: 'status',
        title: 'Estat',
        pathToKey: 'status',
        sorting: 'status',
        cssClasses: ['min-w-[145px]'],
        formatting: {
          type: 'COMPONENT',
          execute: expect.any(Function),
        },
      });
    });

    it('should throw error when execute is called without element', () => {
      const format = service.formatOrderStatus(
        'status',
        'Estat',
        'status',
        ['min-w-[145px]'],
        'status'
      );
      expect(() => format.formatting?.execute?.(null)).toThrow('Element is required');
    });
  });
});
