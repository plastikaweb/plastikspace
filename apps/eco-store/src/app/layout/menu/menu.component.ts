import { ChangeDetectionStrategy, Component, TemplateRef, viewChild } from '@angular/core';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'eco-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatAnchor,
    MatButton,
    MatIconButton,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  readonly primaryMenu = viewChild.required<TemplateRef<unknown>>('primaryMenu');
  readonly secondaryMenu = viewChild.required<TemplateRef<unknown>>('secondaryMenu');
}
