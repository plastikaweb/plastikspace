import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { filter, map } from 'rxjs';

/**
 * From this width up the shell is AMPLE: the rail can stand expanded at 256px and the panel beside it
 * still keeps 720px (976 = 720 + 256, DS §13-bis). Below it the shell is PLEGAT: the rail is forced to
 * 72px and the «menu» button opens the drawer. CALAIX (no rail, compact top bar) belongs to the four
 * phone surfaces, which do not exist yet.
 */
export const ECO_ADMIN_AMPLE_MIN_PX = 976;

/** One key per user: two administrators who share a computer keep their own choice. */
const RAIL_KEY_PREFIX = 'eco-admin-rail';

/**
 * Reads whether this user left the rail folded.
 * @param {string | null} key The user's storage key, or `null` while the user is unknown.
 * @returns {boolean} `true` when the rail was folded.
 */
function readFolded(key: string | null): boolean {
  if (key === null) {
    return false;
  }

  try {
    return localStorage.getItem(key) === '1';
  } catch {
    // A private window or blocked site data: the choice lasts for this visit only.
    return false;
  }
}

/**
 * Remembers whether this user folded the rail.
 * @param {string | null} key The user's storage key, or `null` while the user is unknown.
 * @param {boolean} folded `true` when the rail is folded.
 */
function writeFolded(key: string | null, folded: boolean): void {
  if (key === null) {
    return;
  }

  try {
    localStorage.setItem(key, folded ? '1' : '0');
  } catch {
    // Same as above.
  }
}

/**
 * Which layer the side navigation is in. Provided by the layout and gone with it.
 *
 * In AMPLE the rail is expanded or folded by the user's remembered choice («el seu estat persisteix»,
 * DS §13-bis). In PLEGAT it is folded whatever that choice says, and the toggle opens the drawer
 * instead. The drawer is transient: it is never remembered, and navigating or crossing the cut closes it.
 */
@Injectable()
export class EcoAdminShellState {
  readonly #user = inject(pocketBaseUserProfileStore).user;

  /**
   * In a browser the CDK answers synchronously, so a folded rail never flashes expanded first; the
   * initial value only covers a platform with no media queries.
   */
  readonly #width = toSignal(
    inject(BreakpointObserver)
      .observe(`(min-width: ${ECO_ADMIN_AMPLE_MIN_PX}px)`)
      .pipe(map(state => state.matches)),
    { initialValue: true }
  );

  readonly #url = toSignal(
    inject(Router).events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects)
    )
  );

  /** `null` until the user is known: nothing is read or written under nobody's name. */
  readonly #key = computed(() => {
    const userId = this.#user()?.id;

    return userId ? `${RAIL_KEY_PREFIX}:${userId}` : null;
  });

  readonly #folded = linkedSignal(() => readFolded(this.#key()));

  /** Back to closed whenever the window crosses the cut or the route changes. */
  readonly #drawerOpen = linkedSignal(() => {
    this.#width();
    this.#url();

    return false;
  });

  readonly #hasToggledRail = signal(false);

  /** AMPLE (`true`) or PLEGAT (`false`). */
  readonly width = this.#width;

  /**
   * The rail animates its width only after the user folds or expands it. Loading a page, crossing
   * the cut or a stylesheet arriving late changes the width at once, never with a visible slide.
   */
  readonly railAnimated = this.#hasToggledRail.asReadonly();

  /** The rail shows icons only: folded by the user, or too narrow to be anything else. */
  readonly rail = computed(() => !this.#width() || this.#folded());

  /** The drawer is on screen, over the content. Only PLEGAT has one. */
  readonly drawerOpen = computed(() => !this.#width() && this.#drawerOpen());

  /** The «menu» button: folds or expands the rail in AMPLE, opens or closes the drawer in PLEGAT. */
  toggle(): void {
    if (!this.#width()) {
      this.#drawerOpen.update(open => !open);

      return;
    }

    this.#hasToggledRail.set(true);
    this.#folded.update(folded => !folded);
    writeFolded(this.#key(), this.#folded());
  }

  /** Closes the drawer: its close button, or Material closing it on Escape or the scrim. */
  closeDrawer(): void {
    this.#drawerOpen.set(false);
  }
}
