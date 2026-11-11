import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { ECO_ADMIN_LOGIN_URL } from '@plastik/eco-admin/auth/data-access';

/**
 * What a signed-in administrator sees until the application shell lands (AP-0 0.7, second part).
 *
 * It is a whole page with its own main landmark, and its only action is to close the session,
 * so the login screen can be reached again without clearing the browser storage by hand.
 */
@Component({
  selector: 'eco-admin-provisional-view',
  imports: [MatIcon, TranslatePipe],
  templateUrl: './eco-admin-provisional-view.component.html',
  styleUrl: './eco-admin-provisional-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoAdminProvisionalViewComponent {
  readonly #router = inject(Router);
  readonly #store = inject(pocketBaseUserProfileStore);

  /**
   * Closes the session and goes back to the login screen.
   */
  protected logout(): void {
    this.#store.logout();
    void this.#router.navigateByUrl(ECO_ADMIN_LOGIN_URL);
  }
}
