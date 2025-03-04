import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';

import { formatOrderStatus, formatUserOrderDeliveryDate } from './order-list.util';

describe('order-list-util', () => {
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    const mockSanitizer = {
      bypassSecurityTrustHtml: (html: string) => html,
    };

    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        { provide: DomSanitizer, useValue: mockSanitizer },
      ],
    });
    sanitizer = TestBed.inject(DomSanitizer);
  });

  describe('formatUserOrderDeliveryDate', () => {
    it('should return formatted delivery date for a valid order', () => {
      const order = {
        deliveryType: 'delivery' as LlecoopUserOrder['deliveryType'],
        deliveryTime: '16/17' as LlecoopUserOrder['deliveryTime'],
        deliveryDate: 'tuesday' as LlecoopUserOrder['deliveryDate'],
      };
      const result = formatUserOrderDeliveryDate(order, sanitizer);
      expect(result).toContain('<p>dijous entre les 16h i les 17h</p>');
    });
  });

  describe('formatOrderStatus', () => {
    it('should return formatted order status with default values', () => {
      const format = formatOrderStatus();
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
      const format = formatOrderStatus();
      expect(() => format.formatting?.execute?.(null)).toThrow('Element is required');
    });
  });
});
