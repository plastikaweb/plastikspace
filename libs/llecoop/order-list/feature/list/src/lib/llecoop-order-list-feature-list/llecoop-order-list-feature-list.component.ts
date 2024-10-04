import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'plastik-llecoop-order-list-feature-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './llecoop-order-list-feature-list.component.html',
  styleUrl: './llecoop-order-list-feature-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LlecoopOrderListFeatureListComponent {}
