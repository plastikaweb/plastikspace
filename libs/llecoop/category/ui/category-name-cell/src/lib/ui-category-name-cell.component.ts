import { NgClass, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LlecoopProductCategory } from '@plastik/llecoop/entities';

@Component({
  selector: 'plastik-ui-category-name-cell',
  imports: [RouterLink, NgStyle, NgClass],
  templateUrl: './ui-category-name-cell.component.html',
  styleUrl: './ui-category-name-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCategoryNameCellComponent {
  category = input<LlecoopProductCategory | null>();
  nameStyle = input('');
  withLink = input(false);
}
