import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  isSignal,
  output,
  Signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PushPipe } from '@ngrx/component';
import { Action } from '@ngrx/store';
import { ButtonConfig, ButtonConfigWithAction, buttonHasALinkGuard } from '@plastik/shared/button';
import { ReturnAsObservablePipe } from '@plastik/shared/return-as-observable';
import { TranslatePipe } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'plastik-shared-button',
  imports: [
    NgTemplateOutlet,
    PushPipe,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    AngularSvgIconModule,
    ReturnAsObservablePipe,
    TranslatePipe,
  ],
  templateUrl: './shared-button-ui.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedButtonUiComponent {
  /**
   * @description A configuration object that passes a button configuration to build the button.
   * @param {ButtonConfig} config
   */
  buttonConfig = input.required<ButtonConfig>();

  /**
   * @description Computed signal that returns the link from config if it's a link type button
   */
  linkHref = computed(() => {
    const cfg = this.buttonConfig();
    return buttonHasALinkGuard(cfg) ? cfg.link : undefined;
  });

  /**
   * @description Computed signal that returns true if the button is in loading state
   */
  isLoading = computed(() => {
    const loading = this.buttonConfig().loading;
    return isSignal(loading) ? (loading as Signal<boolean>)() : !!loading;
  });

  /**
   * @description Emits the attached button action on button click.
   */
  sendAction = output<() => Action>();

  onClick(): void {
    if (!buttonHasALinkGuard(this.buttonConfig())) {
      const action = (this.buttonConfig() as ButtonConfigWithAction).doAction?.();
      if (action) {
        this.sendAction.emit(() => action);
      }
    }
  }
}
