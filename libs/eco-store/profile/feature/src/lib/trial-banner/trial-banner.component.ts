import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { AlertType } from '@plastik/core/entities';
import { SharedAlertUiComponent } from '@plastik/shared/alert/ui';
import { differenceInDays } from 'date-fns';

@Component({
  selector: 'eco-trial-banner',
  imports: [SharedAlertUiComponent, MatButtonModule, TranslateModule],
  templateUrl: './trial-banner.component.html',
  styleUrl: './trial-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrialBannerComponent {
  readonly trialEndsAt = input<Date | string | null | undefined>(null);

  readonly becomeMember = output<void>();

  protected readonly daysLeft = computed(() => {
    const endsAt = this.trialEndsAt();

    if (!endsAt) return 0;
    const end = endsAt instanceof Date ? endsAt : new Date(endsAt);
    const diff = differenceInDays(end, new Date());

    return diff > 0 ? diff : 0;
  });

  protected readonly isTrialExpired = computed(() => {
    const endsAt = this.trialEndsAt();

    if (!endsAt) return true;
    const end = endsAt instanceof Date ? endsAt : new Date(endsAt);

    return end.getTime() <= Date.now();
  });

  protected readonly alertType = computed<AlertType>(() =>
    this.isTrialExpired() ? 'ERROR' : 'WARNING'
  );

  protected readonly alertIcon = computed(() =>
    this.isTrialExpired() ? 'warning' : 'hourglass_top'
  );
}
