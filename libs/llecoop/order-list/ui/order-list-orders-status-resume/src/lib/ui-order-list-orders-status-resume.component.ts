import { KeyValue, KeyValuePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LlecoopOrder, llecoopUserOrderStatus } from '@plastik/llecoop/entities';

@Component({
  selector: 'plastik-ui-order-list-orders-status-resume',
  imports: [KeyValuePipe, NgClass, MatIconModule],
  templateUrl: './ui-order-list-orders-status-resume.component.html',
  styleUrls: ['./ui-order-list-orders-status-resume.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiOrderListOrdersStatusResumeComponent {
  orderName = input.required<string>();
  ordersStatus = input.required<LlecoopOrder['userOrdersStatus']>();

  protected getStatusLabel(key: string): string {
    return llecoopUserOrderStatus[key as keyof typeof llecoopUserOrderStatus]?.label;
  }

  protected getStatusClass(key: string): string {
    return llecoopUserOrderStatus[key as keyof typeof llecoopUserOrderStatus]?.class;
  }

  protected getIcon(key: string): string {
    return llecoopUserOrderStatus[key as keyof typeof llecoopUserOrderStatus]?.icon;
  }

  protected compareOrderStatus(a: KeyValue<string, number>, b: KeyValue<string, number>): number {
    const orderPriority: Record<string, number> = {
      waitingReview: 1,
      reviewed: 2,
      delivered: 3,
      notReviewed: 4,
      notDelivered: 5,
      cancelled: 6,
      blocked: 7,
    };

    return orderPriority[a.key] - orderPriority[b.key];
  }
}
