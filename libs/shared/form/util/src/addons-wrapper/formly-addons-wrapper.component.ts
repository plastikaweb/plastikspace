import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  TemplateRef,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'plastik-formly-addons-wrapper',
  templateUrl: './formly-addons-wrapper.component.html',
  styleUrls: ['./formly-addons-wrapper.component.scss'],
  imports: [MatIconModule, MatButtonModule, NgStyle, NgClass, NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyAddonsWrapperComponent extends FieldWrapper {
  matPrefix = viewChild('matPrefix', { read: TemplateRef });
  matSuffix = viewChild('matSuffix', { read: TemplateRef });

  constructor() {
    super();
    effect(() => {
      const prefix = this.matPrefix();
      if (prefix) {
        this.props['prefix'] = prefix;
      }

      const suffix = this.matSuffix();
      if (suffix) {
        this.props['suffix'] = suffix;
      }
    });
  }

  addonRightClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.props['addonRight'].onClick) {
      this.props['addonRight'].onClick(this.field, this.props, this.options);
    }
  }

  addonLeftClick(event: MouseEvent): void {
    event.stopPropagation();
    if (this.props['addonLeft'].onClick) {
      this.props['addonLeft'].onClick(this.field, this.props, this.options);
    }
  }
}
