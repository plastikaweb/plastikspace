import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
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
  styleUrl: './formly-addons-wrapper.component.scss',
  imports: [MatIconModule, MatButtonModule, NgStyle, NgClass, NgTemplateOutlet],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyAddonsWrapperComponent extends FieldWrapper implements AfterViewInit {
  matPrefix = viewChild('matPrefix', { read: TemplateRef });
  matSuffix = viewChild('matSuffix', { read: TemplateRef });
  readonly cdr = inject(ChangeDetectorRef);

  ngAfterViewInit(): void {
    if (this.matPrefix()) {
      this.props['prefix'] = this.matPrefix();
      this.cdr.markForCheck();
    }

    if (this.matSuffix()) {
      this.props['suffix'] = this.matSuffix();
      this.cdr.markForCheck();
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
