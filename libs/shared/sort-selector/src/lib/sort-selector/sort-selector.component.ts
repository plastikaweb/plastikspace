import { KeyValue, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { BasePocketBaseEntitySort, PocketBaseSortOptions } from '@plastik/core/entities';

@Component({
  selector: 'plastik-sort-selector',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, TranslateModule, KeyValuePipe],
  templateUrl: './sort-selector.component.html',
  styleUrls: ['./sort-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortSelectorComponent {
  // TODO: set sort options using generic type.
  options = input.required<PocketBaseSortOptions>();
  currentSort = input.required<BasePocketBaseEntitySort>();
  translationPrefix = input.required<string>();

  sortChange = output<BasePocketBaseEntitySort>();

  onSortChange(sort: BasePocketBaseEntitySort): void {
    this.sortChange.emit(sort);
  }

  optionTrackBy(index: number, entry: KeyValue<string, readonly string[]>): string {
    return entry.key;
  }

  directionTrackBy(index: number, direction: string): string {
    return direction;
  }
}
