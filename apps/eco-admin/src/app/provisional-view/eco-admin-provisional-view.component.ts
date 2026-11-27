import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

/** The heading when the route names no section. */
const FALLBACK_TITLE_KEY = 'shell.placeholder.title';

/**
 * What every entry of the side navigation shows until its view is built: the section's name and a
 * line saying it is not available yet. It renders inside the shell's main landmark, so it carries
 * only the heading of the page.
 */
@Component({
  selector: 'eco-admin-provisional-view',
  imports: [MatIcon, TranslatePipe],
  templateUrl: './eco-admin-provisional-view.component.html',
  styleUrl: './eco-admin-provisional-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoAdminProvisionalViewComponent {
  /** The route's title, which is the i18n key of its rail label. */
  protected readonly titleKey = inject(ActivatedRoute).snapshot.title ?? FALLBACK_TITLE_KEY;
}
