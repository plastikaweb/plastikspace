import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreProduct } from '@plastik/eco-store/entities';
import { HumanizeUnitPipe } from '@plastik/eco-store/shared/utils';

type UnitIconName = 'balance' | 'water_drop' | 'package_2';

@Component({
  selector: 'eco-store-unit-chip',
  imports: [MatChipsModule, MatIcon, TranslateModule, HumanizeUnitPipe],
  templateUrl: './eco-store-unit-chip.component.html',
  styleUrl: './eco-store-unit-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreUnitChipComponent {
  unitType = input.required<EcoStoreProduct['unitType']>();
  unitBase = input.required<EcoStoreProduct['unitBase']>();
  label = input<string>('');

  protected readonly iconName = computed((): UnitIconName => {
    const unitTypeValue: string = this.unitType().toLowerCase();
    if (unitTypeValue.includes('weight')) {
      return 'balance';
    }
    if (unitTypeValue.includes('volume')) {
      return 'water_drop';
    }
    return 'package_2';
  });
}
