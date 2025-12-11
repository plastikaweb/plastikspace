import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { SortConfig, SortMenuOptions } from '@plastik/core/entities';

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
  readonly options = input.required<SortMenuOptions>();
  readonly currentSort = input.required<SortConfig>();
  readonly translationPrefix = input.required<string>();

  readonly sortChange = output<SortConfig>();
  onSortChange(sort: SortConfig): void {
    this.sortChange.emit(sort);
  }

  directionTrackBy(index: number, direction: string): string {
    return direction;
  }
}
