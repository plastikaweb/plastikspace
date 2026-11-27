import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';

@Component({
  selector: 'plastik-ui-category-name-cell',
  imports: [RouterLink],
  templateUrl: './ui-category-name-cell.component.html',
  styleUrl: './ui-category-name-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCategoryNameCellComponent {
  readonly category = input<LlecoopProductCategory | null>();
  readonly nameStyle = input('');
  readonly withLink = input(false);
}
