import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { FormConfig } from '@plastik/core/entities';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { InputSearchFormlyModule } from '@plastik/shared/form/input-search';

@Component({
  selector: 'eco-header',
  imports: [MatToolbar, MatIcon, MatButtonModule, SharedFormFeatureModule, InputSearchFormlyModule],
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
