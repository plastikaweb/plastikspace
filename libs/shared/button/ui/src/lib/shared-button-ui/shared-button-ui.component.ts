import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PushPipe } from '@ngrx/component';
import { Action } from '@ngrx/store';
import { ButtonConfig, buttonHasALinkGuard } from '@plastik/shared/button';
import { ReturnAsObservablePipe } from '@plastik/shared/return-as-observable';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
    selector: 'plastik-shared-button',
    imports: [
        NgClass,
        NgTemplateOutlet,
        PushPipe,
        MatButtonModule,
        AngularSvgIconModule,
        ReturnAsObservablePipe,
    ],
    templateUrl: './shared-button-ui.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedButtonUiComponent {
  /**
   * @description A configuration object that passes a button configuration to build the button.
   * @param {ButtonConfig} config
   */
  @Input() config!: ButtonConfig;

  /**
   * @description Emits the attached button action on button click.
   */
  @Output() sendAction: EventEmitter<() => Action> = new EventEmitter();

  onClick(): void {
    if (!buttonHasALinkGuard(this.config)) {
      this.sendAction.emit(this.config.doAction);
    }
  }
}
