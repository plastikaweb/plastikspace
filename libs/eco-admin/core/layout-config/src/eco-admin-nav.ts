/**
 * One entry of the side navigation. Its path and label are also those of its route under the shell,
 * which `app.routes.spec.ts` of eco-admin checks.
 */
export interface EcoAdminNavItem {
  /** The route path under the shell, without the leading slash. */
  readonly path: string;
  /** The Material Symbols name drawn before the label, and alone in the folded rail. */
  readonly icon: string;
  /** The i18n key of the label. It is also the route title, so the page title says the same. */
  readonly labelKey: string;
  /**
   * Hidden while the tenant has no cycles section: a continuous store with no cycle history
   * (DESIGN-BRIEF §3.10, the tenant-context store's `hasCyclesSection`).
   */
  readonly needsCyclesSection?: boolean;
}

/** Which rail a role gets: the tenant administrator's, or the platform's dark one. */
export type EcoAdminNavVariant = 'tenant' | 'platform';

/**
 * The tenant administrator's rail, in the frozen order of `00 Components/Rail` (round 40.18).
 */
export const ECO_ADMIN_TENANT_NAV: readonly EcoAdminNavItem[] = [
  { path: 'tauler', icon: 'home', labelKey: 'shell.nav.tauler' },
  { path: 'sol-licituds', icon: 'mail', labelKey: 'shell.nav.solLicituds' },
  { path: 'socis', icon: 'groups', labelKey: 'shell.nav.socis' },
  { path: 'comandes', icon: 'receipt_long', labelKey: 'shell.nav.comandes' },
  { path: 'lliuraments', icon: 'local_shipping', labelKey: 'shell.nav.lliuraments' },
  { path: 'cicles', icon: 'autorenew', labelKey: 'shell.nav.cicles', needsCyclesSection: true },
  { path: 'productes', icon: 'grocery', labelKey: 'shell.nav.productes' },
  { path: 'categories', icon: 'category', labelKey: 'shell.nav.categories' },
  { path: 'botiga', icon: 'storefront', labelKey: 'shell.nav.botiga' },
  { path: 'estadistiques', icon: 'monitoring', labelKey: 'shell.nav.estadistiques' },
];

/**
 * The platform administrator's rail (`10 Superadmin/Vista Superadmin`). The mock draws the three
 * entries as tabs of one view; here each has its own route, so it can be linked and the browser's
 * back button works (owner's ruling, 2026-11-20).
 */
export const ECO_ADMIN_PLATFORM_NAV: readonly EcoAdminNavItem[] = [
  { path: 'cooperatives', icon: 'corporate_fare', labelKey: 'shell.nav.cooperatives' },
  { path: 'catalegs', icon: 'public', labelKey: 'shell.nav.catalegs' },
  { path: 'idiomes', icon: 'language', labelKey: 'shell.nav.idiomes' },
];
