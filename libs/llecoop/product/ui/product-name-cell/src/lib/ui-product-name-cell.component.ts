import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LlecoopProduct } from '@plastik/llecoop/entities';

@Component({
  selector: 'plastik-ui-product-name-cell',
  imports: [RouterLink],
  templateUrl: './ui-product-name-cell.component.html',
  styleUrl: './ui-product-name-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiProductNameCellComponent {
  product = input.required<LlecoopProduct>();
}
