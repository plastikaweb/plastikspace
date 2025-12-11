import { MatSort } from '@angular/material/sort';

export type Sorting = Pick<MatSort, 'active' | 'direction'>;

export type SortConfig = {
  active: Sorting['active'];
  direction: Sorting['direction'];
};

export type SortMenuOptions = Record<
  Sorting['active'],
  {
    direction: Sorting['direction'];
    icon: string;
  }[]
>;
