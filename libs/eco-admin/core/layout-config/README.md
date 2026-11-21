# @plastik/eco-admin/layout-config

![Nx](https://img.shields.io/badge/nx-143055?style=for-the-badge&logo=nx&logoColor=white)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)

The side navigation of **eco-admin** as data (AP-0 0.7, part 2): which entries each role gets, in which order, with which icon and label.
Project `eco-admin-layout-config`, tags `scope:eco-admin` + `type:data-access`.

The shell ([`@plastik/eco-admin/layout`](../layout/README.md)) draws these entries, and the app builds its route table from the same records, so a rail entry and its route cannot drift apart.

## Rails

- **`ECO_ADMIN_TENANT_NAV`**, for `TENANT_ADMIN` (path · icon): `tauler` home · `sol-licituds` mail · `socis` groups · `comandes` receipt_long · `lliuraments` local_shipping ·
  `cicles` autorenew · `productes` grocery · `categories` category · `botiga` storefront · `estadistiques` monitoring.
- **`ECO_ADMIN_PLATFORM_NAV`**, for `GLOBAL_ADMIN`: `cooperatives` corporate_fare · `catalegs` public · `idiomes` language.

The order is the frozen one of `00 Components/Rail` and `10 Superadmin/Vista Superadmin` (round 40.18).
Each `EcoAdminNavItem` carries `path`, `icon`, `labelKey` (`shell.nav.*`, which is also the route title) and, for Cicles, `needsCyclesSection`.

A new icon has to be added to the `icon_names` list of the Material Symbols link in `apps/eco-admin/src/index.html`, or it renders as its name.

## `EcoAdminNavigation`

Provided in root.

| Signal    | Value                                                                                                                                 |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| `variant` | `'platform'` for a global administrator, `'tenant'` for everyone else.                                                                |
| `items`   | The entries of that rail. Cicles is left out while the tenant has no cycles section (`hasCyclesSection` of the tenant-context store). |

## Running unit tests

Run `nx test eco-admin-layout-config` to execute the unit tests.
