import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FormConfig } from '@plastik/core/entities';
import { SharedFormFeatureComponent } from '@plastik/shared/form';

@Component({
  selector: 'eco-header',
  imports: [
    MatToolbar,
    MatIcon,
    MatButtonModule,
    RouterLink,
    TranslatePipe,
    SharedFormFeatureComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly formConfig = input.required<FormConfig<{ query: string }>>();
  readonly submitEvent = output<{ query: string }>();

  protected onSubmit(event: { query: string }): void {
    this.submitEvent.emit(event);
  }
}
