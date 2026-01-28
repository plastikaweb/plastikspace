import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormConfig } from '@plastik/core/entities';
import { EcoStoreTenant } from '@plastik/eco-store/entities';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { SharedFormFeatureComponent } from '@plastik/shared/form';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';

@Component({
  selector: 'eco-header',
  imports: [
    MatToolbar,
    MatIcon,
    MatButtonModule,
    RouterLink,
    TranslateModule,
    SharedFormFeatureComponent,
    SharedImgContainerComponent,
    PocketBaseImageUrlPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly formConfig = input<FormConfig<{ query: string }>>();
  readonly tenant = input<EcoStoreTenant | null>();
  readonly submitEvent = output<{ query: string }>();

  protected onSubmit(event: { query: string }): void {
    this.submitEvent.emit(event);
  }
}
