# @plastik/eco/util

Pure functions of the eco platform that both apps need (`scope:eco`, `type:util`). Project `eco-util`.

## Store order window (`store-window.ts`, eco-admin AREF-11, TASKS row 0.6d)

The storefront's header chip and the admin top-bar chip both read the state of a tenant's weekly order window.

| Function                                 | Returns                                                                                |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| `getTenantWindowStatus(tenant, now)`     | `EcoStoreTenantWindowStatus` from the tenant record                                    |
| `getTenantNextOpenDate(tenant, now, st)` | the date a countdown counts to: the next close in the last hour, else the next opening |
| `calculateStoreWindowStatus(now, …)`     | the same state from the window's fields one by one                                     |
| `getNextDateFromTime(now, day, time)`    | the next occurrence of a weekday and `HH:MM`                                           |
| `getMinutesFromStartOfWeek(day, time)`   | minutes since Monday 00:00                                                             |

- The order of the rules: a store the platform deactivated (`active` false) reads `CANCELLED`, one its tenant closed (`closed`) `CLOSED_MANUALLY`, one without a weekly window (continuous selling) `OPEN`.
- Inside the window it reads `OPEN`, or `CLOSING_SOON` in its last hour; outside, `CLOSED`, or `OPENING_SOON` in the two hours before it opens. A window may cross the weekend boundary (Saturday to Monday).
- Weekdays are numbered as `getDay()` numbers them (Sunday 0, Monday 1); `DAYS_MAP` in `@plastik/eco/entities` maps the `SlotDays` names.

Each app keeps its own chip: the storefront shows the state with a countdown, the admin chip opens the «Estat de la botiga» dialog (DESIGN-REVIEWS Paquet 28E point 3).

## Running unit tests

Run `yarn nx test eco-util` to execute the unit tests.
