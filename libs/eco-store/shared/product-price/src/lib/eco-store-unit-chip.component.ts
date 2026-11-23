import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EcoStoreProduct } from '@plastik/eco-store/entities';
import { HumanizeUnitPipe } from '@plastik/eco-store/shared/utils';
import { SharedChipComponent } from '@plastik/shared/chip/ui';

type UnitIconName = 'balance' | 'water_drop' | 'package_2';

@Component({
  selector: 'eco-store-unit-chip',
  imports: [SharedChipComponent, TranslateModule, HumanizeUnitPipe],
  templateUrl: './eco-store-unit-chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreUnitChipComponent {
  readonly unitType = input.required<EcoStoreProduct['unitType']>();
  readonly unitBase = input.required<EcoStoreProduct['unitBase']>();
  readonly label = input<string>('');

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
