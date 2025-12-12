import { KeyValue, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { SortConfig, SortMenuItem, SortMenuOptions } from '@plastik/core/entities';

type SortSelectorKeyValueFn = (
  a: KeyValue<string, SortMenuItem[]>,
  b: KeyValue<string, SortMenuItem[]>
) => number;
@Component({
  selector: 'plastik-sort-selector',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, TranslateModule, KeyValuePipe],
  templateUrl: './sort-selector.component.html',
  styleUrls: ['./sort-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortSelectorComponent {
  readonly options = input.required<SortMenuOptions>();
  readonly currentSort = input.required<SortConfig>();
  readonly translationPrefix = input.required<string>();

  readonly sortChange = output<SortConfig>();

  /*
   * Optional function to customize the order of sort options.
   * Defaults to ordering by the first item's ID.
   */
  readonly orderBy = input<SortSelectorKeyValueFn>(
    (a: KeyValue<string, SortMenuItem[]>, b: KeyValue<string, SortMenuItem[]>): number => {
      return a.value[0].id - b.value[0].id;
    }
  );

  onSortChange(sort: SortConfig): void {
    this.sortChange.emit(sort);
  }
}
