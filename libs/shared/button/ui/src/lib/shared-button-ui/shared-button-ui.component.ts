import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PushPipe } from '@ngrx/component';
import { Action } from '@ngrx/store';
import { ButtonConfig, ButtonConfigWithAction, buttonHasALinkGuard } from '@plastik/shared/button';
import { ReturnAsObservablePipe } from '@plastik/shared/return-as-observable';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'plastik-shared-button',
  imports: [
    NgTemplateOutlet,
    PushPipe,
    MatButtonModule,
    AngularSvgIconModule,
    ReturnAsObservablePipe,
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
