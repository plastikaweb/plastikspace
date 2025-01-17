import { NgClass, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'plastik-formly-addons-wrapper',
  templateUrl: './formly-addons-wrapper.component.html',
  styleUrls: ['./formly-addons-wrapper.component.scss'],
  imports: [MatIconModule, MatButtonModule, NgStyle, NgClass],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyAddonsWrapperComponent extends FieldWrapper implements AfterViewInit {
  @ViewChild('matPrefix', { static: true }) matPrefix!: TemplateRef<unknown>;
  @ViewChild('matSuffix', { static: true }) matSuffix!: TemplateRef<unknown>;

  ngAfterViewInit(): void {
    if (this.matPrefix) {
      this.props['prefix'] = this.matPrefix;
    }

    if (this.matSuffix) {
      this.props['suffix'] = this.matSuffix;
    }
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
