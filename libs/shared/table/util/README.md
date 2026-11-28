# shared-table-util

`@plastik/shared/table/util` (`scope:shared`, `type:util`): pure functions that translate a PocketBase list store's pagination and sort into what `plastik-shared-table` and `mat-paginator` read, and back.
They are eco-admin AREF-05, TASKS row 0.8.

| Function              | From                                                 | To                                            |
| --------------------- | ---------------------------------------------------- | --------------------------------------------- |
| `toTablePagination`   | store `{ page, perPage }`, `page` counted from 1     | `PageEventConfig`, `pageIndex` counted from 0 |
| `fromTablePagination` | `PageEventConfig` (+ the page size before the event) | store `{ page, perPage }`                     |
| `toTableSorting`      | store `SortConfig` `{ active, direction }`           | `TableSortingConfig` `[active, direction]`    |

- A change of page size returns to page 1, as `plastik-shared-table` does: the old index points into a different slicing.
- `fromTablePagination` never asks PocketBase for a page or a page size below 1, and `toTablePagination` reads a page below 1 as the first page.
- Sort needs no adapter on the way back: the table emits `changeSorting` as a `SortConfig`, and it sets `matSortDisableClear`, so the direction is never empty.

`PocketbasePaginationNavigationDirective` (`@plastik/pagination/util`) builds its query parameters with `fromTablePagination`, so the offset between the two page counts lives here only.

## Running unit tests

Run `yarn nx test shared-table-util` to execute the unit tests.
