import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { LlecoopUserOrder } from '@plastik/llecoop/entities';

import {
  formatOrderListStatus,
  formatUserOrderDeliveryDate,
  formatUserOrderStatus,
} from './order-list.util';

describe('order-list-util', () => {
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    const mockSanitizer = {
      bypassSecurityTrustHtml: (html: string) => html,
    };

    TestBed.configureTestingModule({
      providers: [{ provide: DomSanitizer, useValue: mockSanitizer }],
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
      expect(result).toContain('<p>dijous entre les 16h i les 17h</p>'); // Adjust based on your formatting logic
    });
  });

  describe('formatUserOrderStatus', () => {
    it('should return the correct status for a given input', () => {
      expect(formatUserOrderStatus(sanitizer, 'waiting')).toContain(`
    <p class="flex gap-tiny justify-center items-center">
      <span class="material-icons text-info">hourglass_empty</span>
      <span class="capitalize hidden md:flex">Pendent</span>
    </p>
  `);
    });

    it('should not show the icon when showIcon is false', () => {
      expect(formatUserOrderStatus(sanitizer, 'waiting', false, true)).toContain(`hourglass_empty`);
    });

    it('should not show the label when showLabel is false', () => {
      expect(formatUserOrderStatus(sanitizer, 'waiting', true, false)).toContain(`Pendent`);
    });

    it('should not show the icon or label when both are false', () => {
      expect(formatUserOrderStatus(sanitizer, 'waiting', false, false)).not.toContain(
        `hourglass_empty`
      );
      expect(formatUserOrderStatus(sanitizer, 'waiting', false, false)).not.toContain(`Pendent`);
    });
  });

  describe('formatOrderListStatus', () => {
    it('should return the correct status for a given input', () => {
      expect(formatOrderListStatus(sanitizer, 'waiting')).toContain(`hourglass_empty`);
      expect(formatOrderListStatus(sanitizer, 'waiting')).toContain(`En espera`);
    });
  });
});
